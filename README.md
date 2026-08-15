# Vis-Sys-Sage

Vis-Sys-Sage visualizes Sys-Sage component trees and relations for HPC, quantum, and hybrid systems.
It imports Sys-Sage JSON and supported system data. It was created for the bachelor's thesis
*Redesigning sys-sage Data Visualization to Support Relations*.

## Usage

Docker Hub:

```bash
docker pull picodemark/vis-sys-sage:latest
docker run --rm -p 8000:8000 picodemark/vis-sys-sage:latest
```

Every published image is tagged with `latest` and its full Git commit hash.

To run a specific image, replace `<commit-hash>` with its full Git commit hash:

```bash
docker pull picodemark/vis-sys-sage:<commit-hash>
docker run --rm -p 8000:8000 picodemark/vis-sys-sage:<commit-hash>
```

Open `http://localhost:8000`.

Local development:

```bash
docker compose up --build
```

Open `http://localhost:5173`.

## Sources

* [Sys-Sage](https://github.com/caps-tum/sys-sage)
* Research: [HPC](https://doi.org/10.1145/3650200.3656627),
  [HPCQC](https://doi.org/10.23919/ISC.2025.11017506), and
  [previous visualization](https://mediatum.ub.tum.de/doc/1689838/document.pdf)

## License

[Apache License 2.0](./LICENSE)
