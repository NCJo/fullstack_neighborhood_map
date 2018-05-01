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

// Set this to global to prevent error
var map;

function MapViewModel() {
  var self = this;

  this.initMap = function() {
    var elementToPlaceMap = document.getElementById('map');
    var mapProperties = {
      center: new google.maps.LatLng(47.608013, -122.335167),
      zoom: 15,
      // Check 'googleMapStyling.js' for details
      styles: styles,
      mapTypeControl: false
    };
    // NOTE: Only 'center' and 'zoom' are required to construct map
    // Constructing the map using properties from above
    map = new google.maps.Map(elementToPlaceMap, mapProperties);

  };
  this.initMap();
}

function initializeMapApp() {
  ko.applyBinding(new MapViewModel());
}
