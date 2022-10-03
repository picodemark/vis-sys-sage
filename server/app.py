import os

import werkzeug
from flask import Flask, send_from_directory, request

from server.parsers.xml_parser import XMLParser

PORT = 5000

app = Flask(__name__, static_folder="../frontend/build")


@app.route("/data", methods=["GET", "POST"])
@app.errorhandler(werkzeug.exceptions.BadRequest)
def get_data():
    if request.method == "POST":
        if "file" in request.files:
            xml_string = request.files["file"].stream.read().decode("utf-8")
            return XMLParser(xml_string).get_data()
    return "File upload was not successful!", 400


# route to all arbitrary paths
@app.route("/", defaults={"path": ""}, methods=["GET", "POST"])
@app.route("/<path:path>")
def serve(path):
    # only serve build files in production mode
    if os.getenv("FLASK_ENV") == "production":
        if path != "" and os.path.exists(app.static_folder + "/" + path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")
    elif os.getenv("FLASK_ENV") == "development":
        return {}


if __name__ == "__main__":
    app.run(use_reloader=True, port=PORT, threaded=True)
