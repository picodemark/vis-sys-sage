import os

import werkzeug
from flask import Flask, send_from_directory, request

from server.parser.xml_parser import XMLParser
from server.utils.uitls import get_test_json

app = Flask(__name__, static_folder='frontend/build')


@app.route('/data', methods=['POST', 'GET'])
@app.errorhandler(werkzeug.exceptions.BadRequest)
def get_data():
    if request.method == 'POST':
        if 'file' in request.files:
            xml_string = request.files['file'].stream.read().decode('utf-8')
            return XMLParser(xml_string).get_d3_tree_graph()
    return "File upload was not successful!", 400


@app.route('/test')
def get_test_data():
    return get_test_json()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # only serve build files in production
    if os.getenv('FLASK_ENV') == 'production':
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    elif os.getenv('FLASK_ENV') == 'development':
        return {}


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
