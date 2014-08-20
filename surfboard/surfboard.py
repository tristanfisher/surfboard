from flask import Flask, render_template, redirect, json, url_for
from flask import session, request
from flask import flash
from flask import abort

import os

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
    return render_template('index.html', cells=6), 200


if __name__ == '__main__':
    app.run()