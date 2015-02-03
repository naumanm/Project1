// mikeNauman

$(document).ready(function() {
  
  // map object constructor
  var Map = function mapObject () {
    var myLatlng = new google.maps.LatLng(37.79, -122.40);
    var mapOptions = {
      center: myLatlng,
      zoom: 9,
      mapTypeId: 'satellite'
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  // ---- initialize start loop ----

  function initialize() {
    attachEventListeners();
    var myArray = [];
    var myMap = new Map();
    setInterval(function () {issPositionLoop(myMap, myArray);}, 5000); 
  }

  function attachEventListeners() {
    google.maps.event.addDomListener(window, 'load', initialize);
  }

  function issPositionLoop (myMap, myArray) {
    // get ISS data and set callback
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
      // create a hash for lat long
      var latLong = {
        currentLat: data.iss_position.latitude,
        currentLong: data.iss_position.longitude
      };
      // update map and UI
      myArray.push(latLong);
      updateMap(myMap, myArray, latLong);
      updateContent(latLong);
    });
  }

  function updateContent (latLong) {
    $(".latText").text(latLong.currentLat.toFixed(4));
    $(".longText").text(latLong.currentLong.toFixed(4));
    	$(".zoomValue").text($("#mapZoom").val());
  }

  function updateMap (myMap, myArray, latLong) {
    var userZoom = parseInt($("#mapZoom").val(), 10);
    
    if ($("#rad1")[0].checked) {
      userMapTypeID = 'satellite';
    } else if ($("#rad2")[0].checked) {
      userMapTypeID = 'hybrid';
    } else if ($("#rad3")[0].checked) {
      userMapTypeID = 'terrain';
    } else if ($("#rad4")[0].checked) {
      userMapTypeID = 'roadmap';
    } 

    // update map object
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: { lat: latLong.currentLat , lng: latLong.currentLong},
      mapTypeId: userMapTypeID,
      disableDefaultUI: true,
      zoom: userZoom	
    });

    // iss center of map
    var marker = new google.maps.Marker({
      position: { lat: latLong.currentLat , lng: latLong.currentLong},
      map: map,
      title:"ISS",
      icon:'icon-iss3.png',
      setTilt: 45
    });

    // tracking marker
    if ($('#positionTracker').is(':checked')) {
      console.log("this worked");
      myArray.forEach(function (a) {
        var marker = new google.maps.Marker({
          position: { lat: a.currentLat , lng: a.currentLong},
          map: map,
          title:"track",
          icon:'trackDot.png',
          setTilt: 45
        });
      });
    } 
  }

// ----------------------------------

// lets start the party!

initialize();

});


