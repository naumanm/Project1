// mikeNauman

$(document).ready(function() {
  
  // ---- constructors ----

  // map object constructor

  function mapObject () {
    // // need to check local storage for last location
    var map = new google.maps.Map(document.getElementById('map-canvas'));
  }

  // ---- initialize start loop ----

  function initialize() {

    attachEventListeners();

  //  need a function to display a loading page for the map
  //  <div id="map-canvas"></div>

    setInterval(issPositionLoop, 10000); 

  }

  function attachEventListeners() {
    google.maps.event.addDomListener(window, 'load', initialize);
  }

  function issPositionLoop () {
      // get ISS data and set callback
      $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
        // iterate through the data
        $.each( data, function() {
          // create and return hash of lat/long
          var latLong = {
          	currentLat: data.iss_position.latitude,
          	currentLong: data.iss_position.longitude
          };
          // update the map with the current lat long
          updateMap(latLong);
        });
    });
    
    // this should work and is throwing errors
    // console.log(myPostion());
  }


  function updateMap (latLong) {

    var myMap = new mapObject ();

    var mapOptions = {
      center: { lat: latLong.currentLat , lng: latLong.currentLong},
      zoom: 4
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  }


  function myPostion () {
  // TODO: this is not working!!!

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude);
      console.log('More or less ' + crd.accuracy + ' meters.');
    }

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    return navigator.geolocation.getCurrentPosition(success, error, options);

  }

// ----------------------------------

// lets start the party!

initialize();

});


