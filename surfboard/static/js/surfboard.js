var user_settings = localStorage.getItem('surfboard');
user_settings = JSON.parse(user_settings)

api_host = 'http://localhost:8000/api'

// The following won't work if anything has modified Object.prototype
if (jQuery.isEmptyObject(user_settings)){
    console.log('User settings were empty.')
}

/* ------------------------------------- */
no_localstorage_message = 'Local Storage is not available.  Congrats on your vintage browser.  ' +
                            'Not that this message is even properly displaying for you.'
// window.localStorage == indefinite; code.sessionStorage == stores data for session only
function get_localstorage(key){
    if(typeof(Storage) !== 'undefined'){
        return localStorage.getItem(key);
    } else {
        console.warn(no_localstorage_message)
    }
}

function set_localstorage(key, value){
    if(typeof(Storage) !== 'undefined'){
        localStorage.setItem(key, value);
    } else {
        console.warn(no_localstorage_message)
    }
}

function remove_localstorage(key){
    if(typeof(Storage) !== 'undefined'){
        localStorage.removeItem(key);
    } else {
        console.warn(no_localstorage_message)
    }
}


/* ------------------------------------- */
// Controls
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
// Object.getOwnPropertyNames(response)
function user_storage(){
    $.getJSON($SCRIPT_ROOT + '/_get_user_settings',
              function(data){
                  /*
                  console.log('response from get_user_storage: ' + data.user_id);
                  console.log('response from get_user_storage: ' + Object.getOwnPropertyNames(data));
                  */
              })
    .error(function(){ console.error('failed to get user storage.')})
    //.complete(function(){ console.debug('finished fetching user settings')});

}

function new_cell(){
    // not called directly.
    console.log('present options for new cell.')
}

function archive_cell(){
//move a cell to the database; remove it from the board.
}

function null_cell(_args){

    return RSVP.reject();
    /*
    return $('<i class="fa fa-plus"></i>').click(function(){
        new_cell();
    });
    */
}

function configure_cell(){
    console.log('cell configure')
    console.log(this)
    //change parameters/replace/archive
}

function remove_cell(){
    //move cell to archive or remove it
    console.log('cell removed')
}

function refresh_cell(){
    console.log('cell refresh')
}

function maximize_cell(){
    console.log('cell maximize')
}

$(document).ready( function() {

    $(".surf-maximize").click(function() {
        maximize_cell();
      //$( this ).slideUp();
    });

    $(".surf-refresh").click(function() {
        refresh_cell();
      //$( this ).slideUp();
    });

    $(".surf-configure").click(function() {
        configure_cell();
    });

    $(".surf-remove").click(function() {
        remove_cell();
      //$( this ).slideUp();
    });

}); //<------document ready

/* ------------------------------------- */
// Plugins

function map(location_data, breadcrumb, api_key){
//api_key_maps needs to be populated on the page or given to this function

    api_key = api_key || api_key_maps

    //AIzaSyAfV6qE_Vbh0VMD_SlcXZYXtBhxCi6tnEw
/*
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" /> \
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=" + api_key></script> \
 */

    // ECMA approved multiline
    html_response = '<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />' +
        '<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key="' + api_key + '></script>' +
        '<script type="text/javascript">function initialize() { ' +
        'var mapOptions = { center: new google.maps.LatLng(-34.397, 150.644), zoom: 8 };' +
        'var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); }' +
        'google.maps.event.addDomListener(window, "load", initialize);' +
        '</script>';

    //console.log([html_response, 0])
    return new RSVP.Promise(function(resolve, reject){
        resolve([html_response, 0])
            .reject(['Failed to fetch the map.', 2])
    })

}

function weather(zipcode, breadcrumb){
    zipcode = zipcode || 10013;

    function format_weather(temp, weather, city){
        return temp + '<p>' + weather + '<p>' + city + '<p>'
    }

    return new RSVP.Promise(function(resolve, reject){

            $.ajax({
                url: api_host + '/weather/' + zipcode,
                dataType: 'json'
            }).done(function(_json_data){ resolve([format_weather(_json_data.temp_c, _json_data.weather, _json_data.city), breadcrumb])})
                .fail(function(jqXHR, textStatus, errorThrown){reject(errorThrown)});

    });
}

function image(image_url, breadcrumb){

    img_script = $('<img src="' + image_url + '">').fadeIn(500)

    return new RSVP.Promise(function(resolve, reject){

        resolve([ img_script, breadcrumb ]).reject()
        // don't use a reject here because there's not really a failure case to latch onto.
        //reject(console.error('image ' + image_url + 'failed to load.'))
    })
}

function chat(_args){
    return "CHAT!"
}

/* ------------------------------------- */
// Initialization

function dispatch(_func, _args, breadcrumb){
    _func = window[_func]

    if ( typeof _func === "function" ){ return _func(_args, breadcrumb); } //return to init_cells;
    else return null_cell(_args);
}

function init_cells(data_source){
// Initialize the cells with content from data_source.  This function accepts
// an argument so that the screen can be 'wiped' to show a different surfboard.

    data_source = data_source || user_settings;

    //TODO: remove when ready
    for (_setting = 0; _setting < $(".cell").length - 3 ; _setting++)
    {
        //console.log(data_source[_setting])
        current_cell = data_source[_setting]
        plugin = current_cell.plugin;
        plugin_data = current_cell.data;

        if (!plugin){ console.warn(current_cell + ' did not have a plugin'); plugin = null; }

        // TODO: I think these are all firing off at once. see current_cell.cell_id.
        dispatch(plugin, plugin_data, current_cell.cell_id).then(function(dispatch_response){

            //console.log('cell id: ' + current_cell.cell_id + ' plugin: ' + plugin + '; response: ' + dispatch_response)
            $('#' + dispatch_response[1] + "_content").html(dispatch_response[0]);

        }).catch(function(dispatch_error){
            //TODO: find conditions in which this will catch errors.
            //console.error('undefined response from dispatch(' + plugin + ', ' + plugin_data + ')')
        }) //end of dispatch

    }//end of for loop
}

$(document).ready(function(){
    // populate the cells with content!
    init_cells()
    user_storage()
});