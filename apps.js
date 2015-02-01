$(document).ready(function() {
  
  function initialize() {
    // need to check local storage for last location
    var mapOptions = {
      center: { lat: 37.85 , lng: -122.6450},
      zoom: 10
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

  google.maps.event.addDomListener(window, 'load', initialize);

  console.log("calling for ISS location data...");
  $.getJSON("http://api.open-notify.org/iss-now.json", function (data) {
    console.log("data from space", data);
  });

});