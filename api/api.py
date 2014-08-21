from flask import Flask, redirect, json, url_for
from flask import session, request
from flask import abort
from flask import jsonify
import os
import platform


app = Flask(__name__)
app.config.from_object('config')

if platform.system() == 'Darwin':
    app.debug = True

from blueprints import api
app.register_blueprint(api, url_prefix='/api')

@app.route('/dev-site-map')
def dev_site_map():
    links = []
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods:
            url = rule.rule
            #url = url_for(rule.endpoint)
            links.append((url, rule.endpoint))
    return jsonify(links)


@app.route("/site-map")
def site_map():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and len(rule.defaults) >= len(rule.arguments):
            url = url_for(rule.endpoint)
            links.append((url, rule.endpoint))
    # links is now a list of url, endpoint tuples
    return links


@app.route('/')
def index():
    return 'api'




if __name__ == '__main__':
    app.run(port = 8000)