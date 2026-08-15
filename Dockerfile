FROM node:24-slim AS frontend-production

WORKDIR /build

COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN npm install -g pnpm@11.17.0 && pnpm install --frozen-lockfile

COPY frontend .

RUN pnpm build

FROM ubuntu:22.04 AS sys-sage

ARG SYS_SAGE_REPOSITORY=https://github.com/caps-tum/sys-sage.git
ARG SYS_SAGE_REVISION=c72ce813880085328a0044872ffb9b7038058ee5

WORKDIR /build

RUN apt-get update && \
    apt-get -yy install \
                g++ \
                cmake \
                git \
                libxml2-dev \
                nlohmann-json3-dev \
                python3-dev \
                python3-venv \
                pybind11-dev \
                patchelf && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN git init . && \
    git fetch --depth 1 "${SYS_SAGE_REPOSITORY}" "${SYS_SAGE_REVISION}" && \
    git checkout --detach FETCH_HEAD

COPY --from=ghcr.io/astral-sh/uv:0.11.25 /uv /uvx /bin/

RUN cmake -B build -DCMAKE_INSTALL_PREFIX=/usr/local && \
    cmake --build build --parallel && \
    cmake --install build && \
    uv build --wheel --out-dir wheels python && \
    LD_LIBRARY_PATH=/usr/local \
    uvx --from auditwheel==6.5.0 auditwheel repair wheels/*.whl -w wheels/repaired/

FROM python:3.10-slim AS backend-base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

RUN apt-get update && \
    apt-get install -yy libxml2 && \
    rm -rf /var/lib/apt/lists/*

FROM backend-base AS backend-packages

COPY --from=ghcr.io/astral-sh/uv:0.11.25 /uv /uvx /bin/

WORKDIR /app

COPY --from=sys-sage /build/wheels/repaired wheels

COPY backend/uv.lock backend/pyproject.toml ./

FROM backend-packages AS backend-development

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

RUN uv sync --no-install-project --locked
RUN uv pip install --no-deps wheels/py_sys_sage-*.whl

COPY backend .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]

FROM backend-packages AS backend-production-dependencies

RUN uv sync --no-install-project --frozen --no-dev
RUN uv pip install --no-deps wheels/py_sys_sage-*.whl

FROM backend-base AS production

RUN useradd --uid 1000 --create-home app

WORKDIR /app

COPY --from=backend-production-dependencies --chown=app:app /app/.venv .venv
COPY --chown=app:app backend/app app
COPY --from=frontend-production --chown=app:app /build/dist static

USER app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--workers", "4", "--host", "0.0.0.0", "--port", "8000"]
