// mikeNauman

$(document).ready(function() {
  
  // map object constructor
  var Map = function mapObject () {
    var mapOptions = {
      center: new google.maps.LatLng(37.79, -122.40),
      zoom: 9,
      mapTypeId: 'satellite'
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  // initialize and start loop 
  function initialize() {
    var trackingArray = [];
    var myMap = new Map();
    attachEventListeners();
    setInterval(function () {issPositionLoop(myMap, trackingArray);}, 5000); 
  }

  // attach listeners
  function attachEventListeners() {
    google.maps.event.addDomListener(window, 'load', initialize);
  }

  function issPositionLoop (myMap, trackingArray) {
    // get ISS data and set callback
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
      // create a hash for lat long
      var latLong = {
        currentLat: data.iss_position.latitude,
        currentLong: data.iss_position.longitude
      };
      // update map trackingArray and UI
      trackingArray.push(latLong);
      updateMap(myMap, trackingArray, latLong);
      updateContent(latLong);
    });
  }
  
  // updates UI for current map values
  function updateContent (latLong) {
    $(".latText").text(latLong.currentLat.toFixed(4));
    $(".longText").text(latLong.currentLong.toFixed(4));
    	$(".zoomValue").text($("#mapZoom").val());
  }

  // helper function to return the map style radio button
  function mapStyle() {
    if ($("#rad1")[0].checked) {
      return 'satellite';
    } else if ($("#rad2")[0].checked) {
      return 'hybrid';
    } else if ($("#rad3")[0].checked) {
      return 'terrain';
    } else if ($("#rad4")[0].checked) {
      return 'roadmap';
    } 
  }
  
  // updates map, needs improvement
  function updateMap (myMap, trackingArray, latLong) {
    var userZoom = parseInt($("#mapZoom").val(), 10);
    
    // update map object
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: { lat: latLong.currentLat , lng: latLong.currentLong},
      mapTypeId: mapStyle(),
      disableDefaultUI: true,
      zoom: userZoom	
    });

    // put iss icon on center of map
    var marker = new google.maps.Marker({
      position: { lat: latLong.currentLat , lng: latLong.currentLong},
      map: map,
      title:"ISS",
      icon:'icon-iss3.png',
      setTilt: 45
    });

    // place tracking markers
    if ($('#positionTracker').is(':checked')) {
      trackingArray.forEach(function (a) {
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

// lets get it started...

initialize();

});


