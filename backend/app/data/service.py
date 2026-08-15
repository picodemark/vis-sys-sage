import subprocess
import sys
import tempfile
from pathlib import Path
from xml.etree import ElementTree

EXPORTED_FILE_NAME = 'sys-sage.xml'
EXAMPLE_WORKER_MODULE = 'app.data.example_worker'
SYSTEM_DATA_WORKER_MODULE = 'app.data.system_data_worker'
INVALID_DATA_EXIT_CODE = 4
WORKER_TIMEOUT_SECONDS = 60
EXAMPLE_IDS = frozenset({'hpc', 'qc'})
SYSTEM_DATA_FILE_NAMES = {
    'hwloc': 'hwloc.xml',
    'cccbench': 'cccbench.csv',
    'caps_numa': 'caps-numa.csv',
    'iqm': 'iqm.json',
}


class InvalidData(ValueError):
    pass


class NativeFailure(RuntimeError):
    pass


def _local_name(tag: str) -> str:
    return tag.rsplit('}', 1)[-1]


def _prepare_hwloc_xml(hwloc_data: bytes) -> bytes:
    if b'<!ENTITY' in hwloc_data.upper():
        raise InvalidData('XML entities are not supported.')

    try:
        root = ElementTree.fromstring(hwloc_data)
    except ElementTree.ParseError as error:
        raise InvalidData('Invalid hwloc XML.') from error

    if _local_name(root.tag).lower() != 'topology':
        raise InvalidData('The uploaded XML has no hwloc topology root.')
    if not any(_local_name(element.tag).lower() == 'object' for element in root.iter()):
        raise InvalidData('The hwloc topology contains no hardware object.')

    return ElementTree.tostring(root, encoding='utf-8', xml_declaration=True)


def _run_worker(
    command: list[str],
    output_path: Path,
    invalid_data_exit: bool = False,
) -> bytes:
    try:
        completed = subprocess.run(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=WORKER_TIMEOUT_SECONDS,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        raise NativeFailure('Native processing failed.') from error

    if invalid_data_exit and completed.returncode == INVALID_DATA_EXIT_CODE:
        raise InvalidData('Invalid system data.')
    if completed.returncode != 0:
        raise NativeFailure('Native processing failed.')

    try:
        exported_xml = output_path.read_bytes()
    except OSError as error:
        raise NativeFailure('Native processing produced no export.') from error
    if not exported_xml:
        raise NativeFailure('Native processing produced an empty export.')
    return exported_xml


def generate_example(example_id: str) -> bytes:
    try:
        with tempfile.TemporaryDirectory() as temporary_directory:
            output_path = Path(temporary_directory) / EXPORTED_FILE_NAME
            command = [
                sys.executable,
                '-m',
                EXAMPLE_WORKER_MODULE,
                example_id,
                str(output_path),
            ]
            return _run_worker(command, output_path)
    except OSError as error:
        raise NativeFailure('Native processing failed.') from error


def parse_system_data(system_data: dict[str, bytes]) -> bytes:
    if ('cccbench' in system_data or 'caps_numa' in system_data) and 'hwloc' not in system_data:
        raise InvalidData('CCCbench and CAPS NUMA data require an hwloc file.')

    try:
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)
            output_path = temporary_path / EXPORTED_FILE_NAME
            command = [
                sys.executable,
                '-m',
                SYSTEM_DATA_WORKER_MODULE,
                str(output_path),
            ]

            for data_type, file_name in SYSTEM_DATA_FILE_NAMES.items():
                uploaded_data = system_data.get(data_type)
                if uploaded_data is None:
                    continue

                input_path = temporary_path / file_name
                input_path.write_bytes(
                    _prepare_hwloc_xml(uploaded_data) if data_type == 'hwloc' else uploaded_data
                )
                command.extend([f'--{data_type.replace("_", "-")}', str(input_path)])

            return _run_worker(command, output_path, invalid_data_exit=True)
    except OSError as error:
        raise NativeFailure('Native processing failed.') from error
