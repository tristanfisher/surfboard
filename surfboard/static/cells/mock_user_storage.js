var mock_obj = [
    {
        'cell_id': 0,
        'plugin': 'weather',
        'data': '11201'
    },
    {
        'cell_id': 1,
        'plugin': 'chat',
        'data': {'username': 'tristan'}
    },
    {
        'cell_id': 2,
        'plugin': 'image',
        'data': 'http://i.imgur.com/DdyDIkQ.jpg'
    },
    {
        'cell_id': 3,
        'plugin': '',
        'data': ''
    },
    {
        'cell_id': 4,
        'plugin': 'map',
        'data': ''
    },
    {
        'cell_id': 5,
        'plugin': '',
        'data': ''
    }

];

localStorage.setItem('surfboard', JSON.stringify(mock_obj));