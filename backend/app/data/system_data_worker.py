import argparse
from pathlib import Path

import py_sys_sage as pysage

INVALID_DATA_EXIT_CODE = 4


def _check_status(status: int | None, data_type: str) -> None:
    if status not in (None, 0):
        raise ValueError(f'Invalid {data_type} data.')


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    parser.add_argument('--hwloc', type=Path)
    parser.add_argument('--cccbench', type=Path)
    parser.add_argument('--caps-numa', dest='caps_numa', type=Path)
    parser.add_argument('--iqm', type=Path)
    args = parser.parse_args()

    topology = pysage.Topology()
    try:
        node = None

        if args.hwloc is not None:
            node = pysage.Node(topology, 1)
            _check_status(pysage.parseHwlocOutput(node, str(args.hwloc)), 'hwloc')

        if args.cccbench is not None:
            _check_status(pysage.parseCccbenchOutput(node, str(args.cccbench)), 'CCCbench')

        if args.caps_numa is not None:
            _check_status(
                pysage.parseCapsNumaBenchmark(node, str(args.caps_numa)),
                'CAPS NUMA',
            )

        if args.iqm is not None:
            _check_status(pysage.parseIQM(topology, str(args.iqm), 0), 'IQM')
    except (RuntimeError, ValueError):
        return INVALID_DATA_EXIT_CODE

    pysage.exportToXml(topology, str(args.output), None)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
