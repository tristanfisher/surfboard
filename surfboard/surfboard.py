from flask import Flask, render_template, redirect, json, url_for
from flask import session, request
from flask import flash
from flask import abort
import os

def get_config_from_json(json_file='./api_keys.json'):
    try:
        with open(json_file) as key_file:
            keys = json.load(key_file)
            return keys
    except FileNotFoundError as inst:
        import sys
        err, msg = inst.args
        print("Couldn't load API key file.  Error: " + msg, file=sys.stderr)

api_keys = get_config_from_json()

app = Flask(__name__)
app.config.from_object(os.environ.get('FLASK_CONFIG') or 'config')

# Clean up jinja template output:
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

import platform
if platform.system() == 'Darwin':
    app.debug = True

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', api_keys=api_keys, cells=6), 200


if __name__ == '__main__':
    app.run()