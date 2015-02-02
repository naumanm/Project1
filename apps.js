// mikeNauman

$(document).ready(function() {
  
  // ---- constructors ----

  // map object constructor

  // will not work locally
  console.log(myPostion);

  function mapObject () {
    // need to check local storage for last location
    var myLocation = { lat: 37.79 , lng: -122.40};
    var mapOptions = {
      center: myLocation,
      zoom: 4,
      // mapTypeId: 'satellite'
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  // ---- initialize start loop ----

  function initialize() {
    attachEventListeners();
    setInterval(issPositionLoop, 5000); 
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
        updateContent(latLong);
      });
    });
  }

  function updateContent (latLong) {

    var myLat = { lat: latLong.currentLat};
    var myLong = { lng: latLong.currentLong};

    console.log(myLat.lat);
    console.log(myLong);

    $(".latText").text(myLat.lat);
    $(".longText").text(myLong.lng);
  }

  function updateMap (latLong) {

    var myCenter = { lat: latLong.currentLat , lng: latLong.currentLong};

    var mapOptions = { 
      center: myCenter,
      zoom: 4,
      // mapTypeId: 'satellite'
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
      position: myCenter,
      map: map,
      title:"ISS",
      icon:'icon-iss3.png'
    });

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


