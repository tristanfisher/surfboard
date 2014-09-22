from flask import Flask, render_template, redirect, json, url_for, jsonify
from flask import session, request, make_response
from flask import flash
from flask import abort
import os

#this is fine, even if pycharm complains
from models import db


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

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db.init_app(app)

# Clean up jinja template output:
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

import platform
if platform.system() == 'Darwin':
    app.debug = True

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', api_keys=api_keys, cells=6), 200


@app.route('/_save_user_settings')
def _save_user_settings():
    #get settings from user cookie
    cookie_data = request.cookies
    #store in database

    response = make_response('', 200)
    response.set_cookie('cookie_name', value='values')
    return response


#because jquery allows you to set params on gets...
@app.route('/_get_user_settings')
def get_cookie():
    # retreived saved settings from the database for the user
    user_cookie = request.cookies.get('some_key')
    user_id='STUB'
    cell='STUBCELL'
    return jsonify(user_id=user_id, cell=cell)

@app.route('/_archive_cell')
def archive_cell():
    #receive cell data from javascript, store it in the database
    # if successful, return a 200.
    #on the client side, on 200, the cell is removed.
    pass


if __name__ == '__main__':
    app.run()