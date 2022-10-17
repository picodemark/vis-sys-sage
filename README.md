# vis-sys-sage

vis-sys-sage is an application to be run at the localhost for the visual presentation of HPC system states as stored in
the [sys-sage](https://github.com/caps-tum/sys-sage) library.

Major changes may be possible in the future since sys-sage is currently under development.

## Requirements

For running the application, the following requirements have to be satisfied:

- `python` with version 3.8.x
- `pip` is installed

## Setup

Clone the repository to an arbitrary directory and access the cloned repository:

```console
$ git clone https://github.com/picodemark/vis-sys-sage.git
$ cd vis-sys-sage
```

## Installation

### General

The application will be available in your browser at your localhost (http://127.0.0.1:5000).

You can stop the application by terminating the running process in your console.

### Quick Start

The fastest and easiest way to run and use the application is to execute the following script:

```console
$ cd server
$ python3 run.py
```

### Manual Installation

#### Install Python Packages

The application is based on a [Flask](https://flask.palletsprojects.com/en/2.1.x/) server.

You need to create a virtual environment before installing the required packages:

```console
cd server
python3 -m venv venv
```

Activate the virtual environment and install the required packages:

```console
pip install -r requirements.txt
```

#### Run the Server

Go to the server directory:

```console
cd server
```

Activate the virtual environment depending on your OS.

Start the server to be able to use the application locally:

```console
python3 -m flask run 
```

## Development

### Additional Requirements

For the front-end development, preferably [Node.js](https://nodejs.org/en/) 16.18.0 LTS should be installed. Older
versions may also work, but were not tested.

### Start Local Development Servers

The front-end development server can be started locally by running the following commands:

```console
cd frontend
npm start
```

Changes in the front-end code are reloaded immediately and can be seen at the localhost (http://127.0.0.1:3000).

Ensure that the environment variable `FLASK_ENV=development` is set correctly inside `server/.flaskenv`, so that the
debug mode of the Flask server is automatically enabled.

Go to the server directory:

```console
cd server
```

Activate the virtual environment depending on your OS.

Start the server to be able to use the application locally:

```console
python3 -m flask run 
```

Before starting the server, all required Python packages from `requirements.txt` have to be installed, as described
above.

### Create New Production Build

Run the `npm` build command to create a new production version of the front-end code:

```console
cd frontend
npm build
```

## About

vis-sys-sage has been created by Mark Pirkowski ([mark.pirkowski@mytum.de](mark.pirkowski@mytum.de)).

vis-sys-sage is available under the LGPL-2.1 license. (see License)