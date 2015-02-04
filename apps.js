// mikeNauman

$(document).ready(function() {
  
  // map object constructor
  var Map = function mapObject () {

    var mapOptions = {
      center: new google.maps.LatLng(37.79, -122.40),
      zoom: getStoredZoom(),
      mapTypeId: getStoredStyle(),
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  // get and return zoom from local storage
  function getStoredZoom() {
    if(parseInt(localStorage.getItem("userZoom")) > 0) {
      $("#mapZoom").prop('value', localStorage.getItem("userZoom"));
      return (parseInt(localStorage.getItem("userZoom")));
    }
  }

  // get and return map style from local storage
  function getStoredStyle () {
    if(localStorage.getItem("mapStyle").length > 0) {
      // update the UI to reflect the storage value
      if (localStorage.getItem("mapStyle") === "satellite") {
        $("#rad1").prop('checked', true);
        $('#rad1').attr('checked', true);
      } else if (localStorage.getItem("mapStyle") === "hybrid") {
        $("#rad2").prop('checked', true);
      } else if (localStorage.getItem("mapStyle") === "terrain") {
        $("#rad3").prop('checked', true);
      } else if (localStorage.getItem("mapStyle") === "roadmap") {
        $("#rad4").prop('checked', true);
      } else if (localStorage.getItem("mapStyle") === "undefined") {
        console.log("mapStyle is undefined");
      }
      // return the storage item
      return localStorage.getItem("mapStyle");
    } else {
        console.log("mapStyle length is < 0");
        return "roadmap";
    }
  }

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
      updateLocalStorage(latLong);
    });
  }
  
  function updateLocalStorage () {
    // should wrap this in an if to see if a change is needed
    localStorage.setItem("mapStyle", mapStyle());
    localStorage.setItem("userZoom", userZoom());

    console.log("Storage style: " + localStorage.getItem("mapStyle"));
    console.log("Storage zoom: " + localStorage.getItem("userZoom"));
  }

  // updates UI for current map values
  function updateContent (latLong) {
    $(".latText").text(latLong.currentLat.toFixed(4));
    $(".longText").text(latLong.currentLong.toFixed(4));
    $(".zoomValue").text($("#mapZoom").val());
    $(".altitudeText").text("431 km");
    $(".velocityText").text("27,600 kph");
  }

  // updates map, needs improvement
  function updateMap (myMap, trackingArray, latLong) {

    // update map object
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: { lat: latLong.currentLat , lng: latLong.currentLong},
      mapTypeId: mapStyle(),
      disableDefaultUI: true,
      zoom: userZoom()
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

  // helper function to return the map style radio button value
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

  // helper function to get value of zoom slider  
  function userZoom() {
    return parseInt($("#mapZoom").val(), 10);
  }

// ----------------------------------

// lets get it started...

initialize();

});


