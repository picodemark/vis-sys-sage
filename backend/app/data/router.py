from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from starlette.responses import Response

from app.data import service

router = APIRouter(prefix='/api/data', tags=['data'])
MAXIMUM_UPLOAD_SIZE_MEBIBYTES = 20
MAXIMUM_UPLOAD_SIZE_BYTES = MAXIMUM_UPLOAD_SIZE_MEBIBYTES * 1024 * 1024


def _read_upload(file: UploadFile | None, label: str) -> bytes | None:
    if file is None:
        return None

    uploaded_data = file.file.read(MAXIMUM_UPLOAD_SIZE_BYTES + 1)
    if len(uploaded_data) > MAXIMUM_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f'The {label} file exceeds the {MAXIMUM_UPLOAD_SIZE_MEBIBYTES} MiB limit.',
        )
    if not uploaded_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f'The {label} file is empty.',
        )
    return uploaded_data


@router.get('/examples/{example_id}', response_class=Response)
def generate_example(example_id: str):
    if example_id not in service.EXAMPLE_IDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Unknown example: {example_id}.',
        )

    try:
        result = service.generate_example(example_id)
    except service.NativeFailure as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='The native example generator failed.',
        ) from error
    return Response(
        content=result,
        media_type='application/xml',
        headers={'Cache-Control': 'no-store'},
    )


@router.post('/parse', response_class=Response)
def parse_system_data(
    hwloc: Annotated[UploadFile | None, File()] = None,
    cccbench: Annotated[UploadFile | None, File()] = None,
    caps_numa: Annotated[UploadFile | None, File()] = None,
    iqm: Annotated[UploadFile | None, File()] = None,
):
    uploads = {
        'hwloc': _read_upload(hwloc, 'hwloc'),
        'cccbench': _read_upload(cccbench, 'CCCbench'),
        'caps_numa': _read_upload(caps_numa, 'CAPS NUMA'),
        'iqm': _read_upload(iqm, 'IQM'),
    }
    uploaded_data = {data_type: data for data_type, data in uploads.items() if data is not None}

    if not uploaded_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Select at least one system data file.',
        )
    try:
        result = service.parse_system_data(uploaded_data)
    except service.InvalidData as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error
    except service.NativeFailure as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='The native system data parser failed.',
        ) from error
    return Response(content=result, media_type='application/xml')
