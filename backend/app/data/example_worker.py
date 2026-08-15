import argparse
from collections.abc import Callable
from pathlib import Path
from typing import Any
from xml.etree import ElementTree

import py_sys_sage as pysage

EXAMPLE_SOURCE_PATH = Path(__file__).with_name('example_sources')

QC_COMPONENT_ATTRIBUTES = frozenset({'addr', 'id'})
QC_RELATION_ATTRIBUTES = frozenset({'category', 'components', 'id', 'ordered', 'owner'})

LRZ_IQM_FIGURE_6_EDGES = (
    (1, 4),
    (2, 5),
    (3, 8),
    (4, 9),
    (5, 10),
    (6, 11),
    (7, 12),
    (8, 13),
    (9, 14),
    (10, 15),
    (11, 16),
    (12, 17),
    (14, 18),
    (15, 19),
    (16, 20),
    (1, 2),
    (3, 4),
    (4, 5),
    (5, 6),
    (6, 7),
    (8, 9),
    (9, 10),
    (10, 11),
    (11, 12),
    (13, 14),
    (14, 15),
    (15, 16),
    (16, 17),
    (18, 19),
    (19, 20),
)


def _check_status(status: int | None, data_type: str) -> None:
    if status not in (None, 0):
        raise ValueError(f'Invalid {data_type} example data.')


def _build_hpc():
    topology = pysage.Topology()
    node = pysage.Node(topology, 1)
    _check_status(
        pysage.parseHwlocOutput(node, str(EXAMPLE_SOURCE_PATH / 'skylake_hwloc.xml')),
        'hwloc',
    )
    _check_status(
        pysage.parseCapsNumaBenchmark(
            node,
            str(EXAMPLE_SOURCE_PATH / 'skylake_caps_numa_benchmark.csv'),
            ';',
        ),
        'CAPS NUMA',
    )
    return topology


def _build_qc():
    topology = pysage.Topology()
    backend = pysage.QuantumBackend(topology)
    backend.num_qubits = 20

    qubits = {}
    for qubit_id in range(1, 21):
        qubit = pysage.Qubit(backend, qubit_id)
        qubits[qubit_id] = qubit

    for relation_id, (left_id, right_id) in enumerate(LRZ_IQM_FIGURE_6_EDGES, start=1):
        pysage.CouplingMap(
            [qubits[left_id], qubits[right_id]],
            relation_id,
            False,
        )
    return topology


BUILDERS: dict[str, Callable[[], Any]] = {
    'hpc': _build_hpc,
    'qc': _build_qc,
}


def _keep_qc_structure(output_path: Path) -> None:
    tree = ElementTree.parse(output_path)
    components = tree.getroot().find('Components')
    relations = tree.getroot().find('Relations')

    if components is not None:
        for element in components.iter():
            for attribute in tuple(element.attrib):
                if attribute not in QC_COMPONENT_ATTRIBUTES:
                    element.attrib.pop(attribute)

    if relations is not None:
        for element in relations:
            for attribute in tuple(element.attrib):
                if attribute not in QC_RELATION_ATTRIBUTES:
                    element.attrib.pop(attribute)

    tree.write(output_path, encoding='utf-8', xml_declaration=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('example_id', choices=BUILDERS)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()

    topology = BUILDERS[args.example_id]()
    pysage.exportToXml(topology, str(args.output), None)
    if args.example_id == 'qc':
        _keep_qc_structure(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
