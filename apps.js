$(document).ready(function() {
  
  function initialize() {

    // should define constructors
    // should instintiate map and loop object

    // need to check local storage for last location
    var mapOptions = {
      center: { lat: 37.85 , lng: -122.6450},
      zoom: 10
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addDomListener(window, 'load', initialize);

    setInterval(issPosition, 10000); 

  }

  function issPosition () {
      $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
        //var lat = data['iss_position']['latitude'];
        //var lon = data['iss_position']['longitude'];

        console.log(data);
    });
  }


// ----------------------------------

// lets start the party!

initialize();

});