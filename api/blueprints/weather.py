from . import api


@api.route('/weather/<postal_code>', methods=['GET'])
def return_weather_postal_code(postal_code):
    return postal_code

