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
    console.log('present options for new cell.')
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
    return RSVP.reject();
    return 'MAP!'
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

        resolve([ img_script, breadcrumb ])

        reject(console.error('image ' + image_url + 'failed to load.'))

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

            console.log('cell id: ' + current_cell.cell_id + ' plugin: ' + plugin + '; response: ' + dispatch_response)
            $('#' + dispatch_response[1] + "_content").html(dispatch_response[0]);

        }).catch(function(dispatch_error){
            console.error('undefined response from dispatch(' + plugin + ',' + plugin_data + ')')
        }) //end of dispatch

    }//end of for loop
}

$(document).ready(function(){
    // populate the cells with content!
    init_cells()
});