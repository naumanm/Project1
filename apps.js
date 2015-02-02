// mikeNauman

$(document).ready(function() {
  
  // ---- constructors ----

  // map object constructor

  function mapObject () {
    // need to check local storage for last location
    var mapOptions = {
      center: { lat: 37.85 , lng: -122.6450},
      zoom: 10
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  // mapObject.prototype.sayHi = function () {
  //   alert("Hello" + this.name);
  // };

  // ---- initialize start loop ----

  function initialize() {

    attachEventListeners();

  	// instantiate new map
    var myMap = new mapObject ();

    setInterval(issPositionLoop, 10000); 

  }

  function attachEventListeners() {
    google.maps.event.addDomListener(window, 'load', initialize);
  }


  function issPositionLoop () {
      $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {

        $.each( data, function( key, val ) {
          var myLong = data.iss_position.longitude;
          var myLat = data.iss_position.latitude;

          console.log(myLong);
          console.log(myLat);

        });
    });
    
    // this should work and is throwing errors
    // console.log(myPostion());
  }

  function myPostion () {
  
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