# vis-sys-sage-local

## Getting started

### Clone repository

Clone the repository in your directory:

```console
$ git clone 
```

### Install python packages

The application is based on the [Flask](https://flask.palletsprojects.com/en/2.1.x/) server.

You need to create a virtual environment before installing the required packages:

```console
cd server
python3 -m venv venv
```

Activate the virtual environment and install the packages:

```console
pip install -r requirements.txt
```

### Run the server

Go to the server directory:

```console
cd server
```

Activate the virtual environment.

Start the server to be able to use the application locally:

```console
python -m flask run 
```
