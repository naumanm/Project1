// mikeNauman

$(document).ready(function() {

// ---- constructors ----

  var trackingArray;

  var Map = function mapObject () {

    var mapOptions = {
      center: new google.maps.LatLng(37.79, -122.40),
      zoom: getStoredZoom(),
      mapTypeId: getStoredStyle(),
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };

// ---- main ----

  // initialize and start loop 
  function initialize() {
    trackingArray = getTrackingArray();
    myMap = new Map();
    attachEventListeners();
    updateStyleUI();
    updateZoomUI();
    setInterval(function () {issPositionLoop(myMap, trackingArray);}, 5000); 
  }

  // execute on each setInterval
  function issPositionLoop (myMap, trackingArray) {
    // get ISS data and set callback
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
      // create a hash for lat long
      // TODO: this hash contains more than one lat & long
      var latLong = {
        currentLat: data.iss_position.latitude,
        currentLong: data.iss_position.longitude
      };
      // update map trackingArray and UI
      updateTrackingArray(trackingArray, latLong);
      getWeatherData(latLong);
      updateMap(myMap, trackingArray, latLong);
      updateContent(latLong);
      updateLocalStorage(trackingArray);
    });
  }
  
  // update the map
  function updateMap (myMap, trackingArray, latLong) {

    console.log("my map " + myMap);
    console.log("my trackingArray " + trackingArray);
    console.log("my latLong " + latLong);


    // this is creating a new map object, should update the existing one
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: { lat: latLong.currentLat , lng: latLong.currentLong},
      mapTypeId: getMapStyleUI(),
      disableDefaultUI: true,
      zoom: getUserZoomUI()
    });

    // put iss icon on center of map
    var marker = new google.maps.Marker({
      position: { lat: latLong.currentLat , lng: latLong.currentLong},
      map: map,
      title:"ISS",
      icon: displayISSIcon(),
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

// ---- helper functions ----

  function getWeatherData(latLong) {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latLong.currentLat + "&lon=-" + latLong.currentLong, function(data) {
      $(".city").text(data.name);
      $(".temp").text(data.main.temp + " kelvin");
      $(".pressure").text(data.main.pressure + " mB");
      $(".humidity").text(data.main.humidity + "%");
    });
  }

  // push latLong to array, shift if getting big
  function updateTrackingArray(trackingArray, latLong) {
    // if (trackingArray.length > 1000) {
    //   trackingArray.shift();
       trackingArray.push(latLong);
    // }
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
    localStorage.setItem("myTrackingArray", JSON.stringify(trackingArray));
  }

  function getTrackingArray () {

    var myArray =  JSON.parse(localStorage.getItem("myTrackingArray"));    

    // if (myArray.length === null) {
    //   return []; 
    // } else {
       return myArray;
    // }
  }

  function attachEventListeners() {
    google.maps.event.addDomListener(window, 'load', initialize);
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
    if(localStorage.getItem("mapStyle").length > 0) {
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
    } else if (localStorage.getItem("mapStyle") === "undefined") {
      console.log("mapStyle is undefined");
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


