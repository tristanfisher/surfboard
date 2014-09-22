var mock_obj = [
    {
        'cell_id': 0,
        'plugin': 'weather',
        'data': '98109'
    },
    {
        'cell_id': 1,
        'plugin': 'map',
        'data': '10012'
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
        'plugin': 'stub',
        'data': ''
    },
    {
        'cell_id': 5,
        'plugin': '',
        'data': ''
    }
];

localStorage.setItem('surfboard', JSON.stringify(mock_obj));