// mikeNauman

$(document).ready(function() {
  
  // ---- constructors ----

  // map object constructor

  // will not work locally
  //console.log(myPostion);

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
    $(".latText").text(latLong.currentLat.toFixed(4));
    $(".longText").text(latLong.currentLong.toFixed(4));
  }

  function updateMap (latLong) {
    var myMapTypeID;
    
    if ($("#rad1")[0].checked) {
      myMapTypeID = 'satellite';
    } else if ($("#rad2")[0].checked) {
      myMapTypeID = 'hybrid';
    } else if ($("#rad3")[0].checked) {
      myMapTypeID = 'terrain';
    } else if ($("#rad4")[0].checked) {
      myMapTypeID = 'roadmap';
    } 

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: { lat: latLong.currentLat , lng: latLong.currentLong},
      zoom: 4,
      mapTypeId: myMapTypeID,
      disableDefaultUI: true

    });

    var marker = new google.maps.Marker({
      position: { lat: latLong.currentLat , lng: latLong.currentLong},
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


