var user_settings = localStorage.getItem('surfboard');

user_settings = JSON.parse(user_settings)

// The following won't work if anything has modified Object.prototype
if (jQuery.isEmptyObject(user_settings)){
    console.log('User settings were empty.')
}

/* ------------------------------------- */
// Controls

function configure_cell(){
    console.log('cell configure.')
}

function remove_cell(){
    console.log('cell removed.')
}

function refresh_cell(){
    console.log('cell refresh')
}

$(document).ready( function() {

    $(".surf-refresh").click(function() {
        refresh_cell()
      //$( this ).slideUp();
    });


    $(".surf-configure").click(function() {
        configure_cell()
    });

    $(".surf-remove").click(function() {
        remove_cell()
      //$( this ).slideUp();
    });

}); //<------document ready

/* ------------------------------------- */
// Plugins

function map(){
    return 'MAP!'
}

function weather(){
    /*
    $.ajax({
        url: url,
        data: data,
        success: success,
        dataType: dataType
    });
    */
    return "weather"
}

function image(_args){
    return "IMAGE!"
}

function chat(_args){
    return "CHAT!"
}

function null_cell(_args){
    return "[Click to add content]"
}

function dispatch(_func, _args){
    //Switch dispatcher:
    switch(_func){
        case "weather": return weather(_args); break;
        case "map": return map(_args); break;
        case "chat": return chat(_args); break;
        case "image": return image(_args); break;
        case null: return null_cell(_args); break;
    }
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

        if (!data_source[_setting].plugin){
            plugin = null;
        }

        // insert into the div, dont replace div itself
        try{ dispatch(plugin); } //if fails, plugin not available
        catch(err){ console.error("Plugin not available: " + err); }

        dispatch_return = dispatch(plugin)
        console.log(dispatch_return)

        //$('#' + data_source[_setting].cell_id + "_content").html(plugin);
        $('#' + data_source[_setting].cell_id + "_content").html(dispatch_return);
    }

}

$(document).ready(function(){
    // populate the cells with content!
    init_cells()
});