var user_settings = localStorage.getItem('surfboard');

user_settings = JSON.parse(user_settings)

// The following won't work if anything has modified Object.prototype
if (jQuery.isEmptyObject(user_settings)){
    console.log('User settings were empty.')
}

/* ------------------------------------- */

function configure_cell(){
    console.log('cell configure.')
}

function remove_cell(){
    console.log('cell removed.')
}

function refresh_cell(){
    console.log('cell refresh')
}

function dispatch(_func, _args){
    console.log(_func, _args);
}


/* --------------------- */
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

function map(){
    return 'map'
}

function init_cells(data_source){
// Initialize the cells with content from data_source.  This function accepts
// an argument so that the screen can be 'wiped' to show a different surfboard.

    data_source = data_source || user_settings;

    for (_setting = 0; _setting < $(".cell").length; _setting++)
       {
           $('#' + data_source[_setting].cell_id + "_content").replaceWith('content replaced')

           //console.log(data_source[_setting].cell_id)
           //console.log(data_source[_setting].plugin)
           //console.log('#------------------#')
       }
}

$(document).ready(function(){
   // populate the cells with content!
    init_cells()

});