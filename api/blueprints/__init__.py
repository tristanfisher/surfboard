from flask import Blueprint, g
from errors import ValidationError, bad_request, not_found
import json

def get_config_from_json(json_file='./private_keys.json'):
    try:
        with open(json_file) as key_file:
            keys = json.load(key_file)
            return keys
    except FileNotFoundError as inst:
        err, msg = inst.args
        raise("Couldn't load API key file.  Error: " + msg)

api = Blueprint('api', __name__)
api_keys = get_config_from_json()


@api.errorhandler(ValidationError)
def validation_error(e):
    return bad_request(e.args[0])


@api.errorhandler(400)
def bad_request_error(e):
    return bad_request('invalid request')


@api.errorhandler(404)
def not_found_error(e):
    return not_found('item not found')


@api.after_request
def after_request(response):
    if hasattr(g, 'headers'):
        response.headers.extend(g.headers)
    return response

# do this last to avoid circular dependencies
from . import weather