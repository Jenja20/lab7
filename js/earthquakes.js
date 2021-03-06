/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';
gov.usgs.quakes
gov.usgs.quakesMap

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

$(function(){
	getQuakes();
}); //onReady

//getQuakes()
//queries the server for the list of recent quakes
//and plots them on a Google map
function getQuakes() {
	$.getJSON(gov.usgs.quakesUrl, function(quakes){
	    gov.usgs.quakes = quakes;
	    $(".message").html("Displaying" + quakes.length + "earthquakes");

	    gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
		    center: new google.maps.LatLng(0,0),        //centered on 0/0
		    zoom: 2,                                    //zoom level 2
		    mapTypeId: google.maps.MapTypeId.TERRAIN,   //terrain map
		    streetViewControl: false                    //no street view
		});

	    addQuakeMarkers(quakes, gov.usgs.quakesMap);
	}); //handle returned data function

	$(".message").html("Loading... <img src=\"img/loading.gif\">");

} //getQuakes()

function addQuakeMarkers(quakes, map) {
    var quake;
    var idx;

    for (idx = 0; idx < quakes.length; ++idx) {
            quake = quakes[idx];

        //fixed function to find location and puts into infobox
        if (quake.location.longitude && quake.location.latitude) {
            var lat = quake.location.latitude;
            var long = quake.location.longitude;

            quake.mapMarker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(lat, long)
            });
		
			infoWindow = new google.maps.InfoWindow({
                    content: new Date(quake.datetime).toLocaleString() +
                    ': magnitude ' + quake.magnitude + ' at depth of ' +
                    quake.depth + ' meters'
            });

            registerInfoWindow(map, quake.mapMarker, infoWindow);

        }
	}
} //addquakemarkers

function registerInfoWindow(map, marker, infoWindow) {
    google.maps.event.addListener(marker, 'click', function(){
    	gov.usgs.iw = infoWindow;

        infoWindow.open(map, marker);
    });                
} //registerInfoWindow()

