from . import api, api_keys
from flask import jsonify
from flask import current_app
import requests
import json

# If this starts failing, yahoo has a public API as well.
WUNDERGROUND_URL_BASE="{base}{api_key}{suffix}".format(
    base="https://api.wunderground.com/api/",
    api_key=api_keys['wunderground'],
    suffix="/forecast/conditions/q/"
    #suffix="/conditions/q/CA/San_Francisco.json"
)


@api.route('/weather/<postal_code>', methods=['GET'])
def return_weather_postal_code(postal_code):

    #check cache for postal_code first.
    #https://api.wunderground.com/api/0002f35bcb37c341/forecast/conditions/q/11201.json
    WUNDERGROUND_URL = WUNDERGROUND_URL_BASE+postal_code+".json"

    r = requests.get(WUNDERGROUND_URL)

    if r.status_code == 200:
        response = r.text
        #if 'application/json' not in r.headers['content-type']:
        try:
            response = json.loads(response)
        except ValueError:
            return jsonify(status="Received invalid response from API (Could not parse JSON)"), 500

        weather_data = {}

        weather_data['data_source'] = 'wunderground'

        co = response['current_observation']
        weather_data['city'] = co['display_location']['city']
        weather_data['state'] = co['display_location']['state']
        weather_data['country'] = co['display_location']['country']
        weather_data['zip'] = co['display_location']['zip']
        weather_data['latitude'] = co['display_location']['latitude']
        weather_data['longitude'] = co['display_location']['longitude']
        weather_data['observation_epoch'] = co['observation_epoch']
        weather_data['weather'] = co['weather']
        weather_data['temp_f'] = co['temp_f']
        weather_data['temp_c'] = co['temp_c']
        weather_data['wind_string'] = co['wind_string']

        sforecastday = response['forecast']['simpleforecast']['forecastday']
        weather_data['forecast'] = {}

        for day in sforecastday:
            weather_data['forecast'][day['date']['day']] = {
                'conditions': day['conditions'],
                'day': day['date']['day'],
                'high': day['low'],
                'low': day['high']
            }  # weather_data['forecast'][22]

        return json.dumps(weather_data)

    else:
        return jsonify(response='There was an error fetching the weather.', status_code=r.status_code)

