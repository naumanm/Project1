// mikeNauman

$(document).ready(function() {

// ---- constructors ----

  var trackingArray;
  var issArray = [];
  var markerArray = [];

  var Map = function mapObject () {
    var mapOptions = {
      center: new google.maps.LatLng(37.79, -122.40),
      zoom: getStoredZoom(),
      mapTypeId: getStoredStyle(),
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

  var Marker = function markerObject () {
    var markerOptions = {
      position: { lat: 37.79 , lng: -122.40},
      map: this.map,
      title:"ISS",
      icon: displayISSIcon(),
      setTilt: 45
    };
    this.marker = new google.maps.Marker(markerOptions);
  };

// ---- main ----

  // initialize and start loop 
  function initialize() {
    trackingArray = getTrackingArray();
    myMap = new Map();
    myIssMarker = new Marker();
    updateStyleUI();
    updateZoomUI();
    setInterval(function () {issPositionLoop(myMap, myIssMarker, trackingArray);}, 1000); 
  }

  // execute on each setInterval
  function issPositionLoop (myMap, myMarker, trackingArray) {
    // get ISS data and set callback
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
      // create a hash for lat long
      var latLong = {
        currentLat: data.iss_position.latitude,
        currentLong: data.iss_position.longitude
      };
      // update map trackingArray and UI
      updateTrackingArray(trackingArray, latLong);
      getWeatherData(latLong);
      updateMapDisplay(myMap, trackingArray, latLong, myIssMarker);
      updateContent(latLong);
      updateLocalStorage(trackingArray);
    });
  }
  
  // update the map
  function updateMapDisplay (myMap, trackingArray, latLong, myIssMarker) {
    updateMap(myMap, latLong);
    iconDisplayISS(myMap, myIssMarker, latLong);
    trackingMarkers(myMap, trackingArray);
  }

// ---- helper functions ----

  function iconDisplayISS (myMap, myIssMarker, latLong) {
    console.log(myIssMarker);
    var map = myMap.map;

    issArray.forEach(function (a) {
      a.setMap(null);
    });
    issArray = [];

    if ($('#iconSwitch').is(':checked')) {
      var issMarker = new google.maps.Marker({
        position: { lat: latLong.currentLat , lng: latLong.currentLong},
        map: map,
        title:"ISS",
        icon: displayISSIcon(),
        setTilt: 45
      });
      issArray.push(issMarker);
    }
  }

  function trackingMarkers(myMap, trackingArray) {
    if ($('#positionTracker').is(':checked')) {
      var map = myMap.map;
      trackingArray.forEach(function (a) {
        var positionMarker = new google.maps.Marker({
          position: { lat: a.currentLat , lng: a.currentLong},
          map: map,
          title:"track",
          icon:'trackDot.png',
          setTilt: 45
        });
      markerArray.push(positionMarker);
      });
    } else {
      markerArray.forEach(function (a) {
        a.setMap(null);
      });
      markerArray = [];
    }
  }

  function updateMap(myMap, latLong) {
    myMap.map.setCenter(new google.maps.LatLng(latLong.currentLat, latLong.currentLong));
    myMap.map.setMapTypeId(getMapStyleUI());
    myMap.map.setZoom(getUserZoomUI());
  }

  function getWeatherData(latLong) {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latLong.currentLat + "&lon=-" + latLong.currentLong, function(data) {
      $(".city").text(data.name);
      $(".temp").text(data.main.temp + " kelvin");
      $(".pressure").text(data.main.pressure + " mB");
      $(".humidity").text(data.main.humidity + "%");
    });
  }

  // push latLong to array, shift if getting too big
  function updateTrackingArray(trackingArray, latLong) {    
    if (trackingArray !== null) {
      if (trackingArray.length > 5000) {
        trackingArray.shift();
      } 
    }
    trackingArray.push(latLong);
    localStorage.setItem("myTrackingArray", JSON.stringify(trackingArray));
    return trackingArray;
  }

  // return icon value for display
  function displayISSIcon () {
    if ($('#iconSwitch').is(':checked')) {
        return 'icon-iss3.png';
    } else {
        return 'blueDot.png';
    }
  }

  function updateLocalStorage (trackingArray) {
    // TODO: should wrap this in an if to see if a change is needed
    localStorage.setItem("mapStyle", getMapStyleUI());
    localStorage.setItem("userZoom", getUserZoomUI());
    localStorage.setItem("trackingArray", JSON.stringify(trackingArray));
  }

  function getTrackingArray () {
    var myArray =  JSON.parse(localStorage.getItem("trackingArray"));
    if (myArray === null) {
      console.log("array does not exist");
      localStorage.setItem("mapStyle", "hybrid");
      localStorage.setItem("userZoom", 9);
      localStorage.setItem("trackingArray", JSON.stringify([]));    
      return JSON.parse(localStorage.getItem("trackingArray"));
    }
    return myArray;
  }

  // updates UI for current map values
  function updateContent (latLong) {
    $(".latText").text(latLong.currentLat.toFixed(4));
    $(".longText").text(latLong.currentLong.toFixed(4));
    $(".altitudeText").text("431 km");
    $(".velocityText").text("27,600 kph");
    $(".zoomValue").text(getUserZoomUI());
  }

  // returns style from storage
  function getStoredStyle () {
    if(localStorage.length > 0) {
      return localStorage.getItem("mapStyle");
    } else {
      return "roadmap";
    }
  }

  // updates style UI from local storage
  function  updateStyleUI () {
    if (localStorage.getItem("mapStyle") === "satellite") {
      $("#rad1").prop('checked', true);
    } else if (localStorage.getItem("mapStyle") === "hybrid") {
      $("#rad2").prop('checked', true);
    } else if (localStorage.getItem("mapStyle") === "terrain") {
      $("#rad3").prop('checked', true);
    } else if (localStorage.getItem("mapStyle") === "roadmap") {
      $("#rad4").prop('checked', true);
    }
  }

  // helper function to return the map style radio button value
  function getMapStyleUI() {
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

  // returns zoom value from storage
  function getStoredZoom() {
    if(parseInt(localStorage.getItem("userZoom")) > 0) {
      $("#mapZoom").prop('value', localStorage.getItem("userZoom"));
      return (parseInt(localStorage.getItem("userZoom")));
    }
  }

  // updates zoom UI from local storage
  function updateZoomUI () {
    $("#mapZoom").prop('value', localStorage.getItem("userZoom") );
    $(".zoomValue").text(localStorage.getItem("userZoom"));
  }

  // returns value of zoom UI
  function getUserZoomUI() {
    return parseInt($("#mapZoom").prop('value'));
  }

// ----------------------------------

// letsDoThis...

initialize();

});


