# !/usr/bin/env python3
import os
import subprocess
import sys
import webbrowser
from pathlib import Path
from time import sleep

if sys.version_info < (3, 0, 0):
    print('This script assumes at least python3!')
    sys.exit(1)

ROOT = Path(__file__).parent.resolve()


def check_privileges():
    if sys.platform == "linux" or sys.platform == "linux2" or sys.platform == "darwin":
        if not os.environ.get("SUDO_UID") and os.geteuid() != 0:
            print("You need to run this script with sudo or as root.")
            sys.exit(1)


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
    print("Install PyPI packages...")
    # determine required
    run([get_python_executable(), "-m", "pip", "install", "--upgrade", "pip"])
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
    print("Open application at http://127.0.0.1:5000...")
    webbrowser.open("http://127.0.0.1:5000", new=2)


def check_existing_folder(folder):
    return folder.exists()


def main() -> None:
    # check for needed privileges
    check_privileges()

    # setup all requirements to run actual server
    setup_server()

    # open localhost in web browser
    open_localhost_in_browser()

    # run the server
    run_server()


if __name__ == "__main__":
    main()
