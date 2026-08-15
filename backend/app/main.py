from pathlib import Path

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from app.data.router import router as data_router

STATIC_PATH = Path(__file__).resolve().parent.parent / 'static'
app = FastAPI(title='Vis-Sys-Sage')


@app.get('/health/', tags=['health'])
def health():
    return {'status': 'ok'}


app.include_router(data_router)

if STATIC_PATH.is_dir():
    app.mount('/', StaticFiles(directory=STATIC_PATH, html=True), name='static')
