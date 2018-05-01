// FOR DEBUG
// var map;
//
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: 47.608013, lng: -122.335167},
//     zoom: 15,
//     // Check 'googleMapStyling.js' for details
//     styles: styles,
//     mapTypeControl: false
//   });
// }
// End for DEBUG

// Set this to global to prevent error
var map;
var markers = [];

function MapViewModel() {
  var self = this;

  this.initMap = function() {
    var elementToPlaceMap = document.getElementById('map');
    var mapProperties = {
      center: new google.maps.LatLng(47.608013, -122.335167),
      zoom: 14,
      // Check 'googleMapStyling.js' for details
      styles: styles,
      mapTypeControl: false
    };
    // NOTE: Only 'center' and 'zoom' are required to construct map
    // Constructing the map using properties from above
    map = new google.maps.Map(elementToPlaceMap, mapProperties);

    // Make InfoWindow
    this.largeInfoWindow = new google.maps.InfoWindow();
    // The folowing loop use location array to create an array of markers on the starting map
    for (var i = 0; i < myPOIs.length; i++) {
      this.title = myPOIs[i].title;
      this.lat = myPOIs[i].lat;
      this.lng = myPOIs[i].lng;
      this.detail = myPOIs[i].detail;

      this.marker = new google.maps.Marker({
        map: map,
        title: this.title,
        position: { lat: this.lat, lng: this.lng },
        animation: google.maps.Animation.BOUNCE,
        id: i
      });

      // Add each marker into a list of markers
      this.marker.setMap(map);
      markers.push(this.marker);
    }

  };
  this.initMap();
}

function initializeMapApp() {
  ko.applyBinding(new MapViewModel());
}
