from flask import Flask, redirect, json, url_for, g
from flask import jsonify
from flask.ext.cors import CORS

import os
import platform
import sys

app = Flask(__name__)
app.config.from_object('config')
if platform.system() == 'Darwin':
    app.debug = True

from blueprints import api
app.register_blueprint(api, url_prefix='/api')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
    """Return api endpoints to the user"""
    endpoints = []
    for api_endpoint in app.url_map.iter_rules():
        if api_endpoint.rule.startswith('/api'):
            url = api_endpoint.rule
            methods = api_endpoint.methods
            endpoints.append((url, str(methods)))
    return jsonify(endpoints)



if __name__ == '__main__':
    app.run(port = 8000)