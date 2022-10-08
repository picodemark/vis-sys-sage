# !/usr/bin/env python3
import subprocess
import sys
import webbrowser
from pathlib import Path
from time import sleep

LOCALHOST = "http://127.0.0.1:5000"

if sys.version_info < (3, 8, 0):
    print("This script assumes at least python 3.8!")
    sys.exit(1)

ROOT = Path(__file__).parent.resolve()


def run(cmd):
    return subprocess.run(cmd)


def get_python_executable():
    if sys.platform == "linux" or sys.platform == "linux2" or sys.platform == "darwin":
        return "./venv/bin/python"
    elif sys.platform == "win32":
        return "./venv/Scripts/python.exe"
    return None


def create_venv():
    print("Create venv...")
    run(["python3", "-m", "venv", "venv", ])
    # wait until venv is created
    sleep(30)


def install_packages():
    print("Upgrade pip...")
    run([get_python_executable(), "-m", "pip", "install", "--upgrade", "pip"])
    print("Install PyPI packages from requirements.txt...")
    run([get_python_executable(), "-m", "pip", "install", "-r", "requirements.txt"])


def setup_server():
    print("Setup virtual environment if needed...")
    if not check_existing_folder(ROOT.joinpath("venv")):
        # create virtual environment
        create_venv()

        # install all PyPI packages
        install_packages()


def run_server():
    print("Run flask server...")
    run([get_python_executable(), "-m", "flask", "run"])


def open_localhost_in_browser():
    print(f"Open application at {LOCALHOST}...")
    webbrowser.open(LOCALHOST, new=2)


def check_existing_folder(folder):
    return folder.exists()


def main():
    # setup all requirements to run actual server
    setup_server()

    # open localhost in web browser
    open_localhost_in_browser()

    # run the server
    run_server()


if __name__ == "__main__":
    main()
