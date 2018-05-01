var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.608013, lng: -122.335167},
    zoom: 15,
    // Check 'googleMapStyling.js' for details
    styles: styles,
    mapTypeControl: false
  });
}

function MapViewModel() {
  var self = this;

}
