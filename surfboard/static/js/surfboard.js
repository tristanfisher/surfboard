var user_settings = localStorage.getItem('surfboard');

user_settings = JSON.parse(user_settings)

api_host = 'http://localhost:8000/api'

// The following won't work if anything has modified Object.prototype
if (jQuery.isEmptyObject(user_settings)){
    console.log('User settings were empty.')
}

/* ------------------------------------- */
// Controls
function new_cell(){
// not called directly.

}

function configure_cell(){
    console.log('cell configure')
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

function map(){
    return 'MAP!'
}

function weather(zipcode){
    zipcode = zipcode || 10013;

    function get_weather(callback){ //callback is the return handler
        $.ajax({
            url: api_host + '/weather/' + zipcode,
            data: '',
            success: callback,
            error: callback,
            dataType: 'json'
        });
    }

    get_weather(function(parse_weather_callback){
        response = parse_weather_callback
        console.log('postal code: ' + response.zip + ' weather: ' + response.weather);
        return response.weather;
    });

}

function image(image_url){
    return $('<img src="' + image_url + '">').fadeIn(500)
}

function chat(_args){
    return "CHAT!"
}

function null_cell(_args){
    return $('<i class="fa fa-plus"></i>').click(function(){
        new_cell();

    });
}

function dispatch(_func, _args){
    _func = window[_func]
    if ( typeof _func === "function" ) return _func(_args);
    else return null_cell();
}

/* ------------------------------------- */
// Initialization

function init_cells(data_source){
// Initialize the cells with content from data_source.  This function accepts
// an argument so that the screen can be 'wiped' to show a different surfboard.

    data_source = data_source || user_settings;

    for (_setting = 0; _setting < $(".cell").length; _setting++)
    {
        plugin = data_source[_setting].plugin;
        plugin_data = data_source[_setting].data;

        // if the plugin is an empty string, set it to null.
        if (!data_source[_setting].plugin){
            plugin = null;
        }

        // todo:: revamp this -- I'm not sure it actually prevents
        // a broken plugin from affecting others. //plugin_data
        try{

            // This bit is firing syncronously and is returning beore the event returns.
            //Try promises?
            dispatch_return = dispatch(plugin, plugin_data)

            if (dispatch_return == undefined){
                console.error('undefined response from dispatch(' + plugin + ',' + plugin_data + ')')
                dispatch_return = 'error';
            }

            $('#' + data_source[_setting].cell_id + "_content").html(dispatch_return);
            console.log(dispatch_return)

        }
        catch(err){
            console.error("Plugin not available: " + err);
            dispatch_return = '<i class="fa fa-puzzle-piece"> Failed to load plugin: <i>' + plugin + '</i></i>'
        }
    }
}

$(document).ready(function(){
    // populate the cells with content!
    init_cells()
});