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

// Set these to global scope to prevent error
var map;
// var markers = [];


function MapViewModel() {
  var self = this;

  // From search bar in the main page to filter out some markers
  this.searchOption = ko.observable("");
  this.markers = [];

  // MAIN FUNCTIONS
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
    // The following loop use location array to create an array of markers on the starting map
    for (var i = 0; i < myPOIs.length; i++) {
      this.title = myPOIs[i].title;
      this.lat = myPOIs[i].lat;
      this.lng = myPOIs[i].lng;
      this.address = myPOIs[i].address;

      this.marker = new google.maps.Marker({
        map: map,
        title: this.title,
        address: this.address,
        position: { lat: this.lat, lng: this.lng },
        animation: google.maps.Animation.DROP,
        id: i
      });

      // Add each marker into a list of markers
      this.marker.setMap(map);
      this.markers.push(this.marker);
      // this.marker.addListener('click', self.populateAndBounceMarker);
      this.marker.addListener('click', function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
      })
    }
  };
  this.initMap();

  // This function populates the infowindow when the marker is clicked. We'll only allow one infowindow  which will open at the marker that is clicked, and populate based on that markers position
  this.populateInfoWindow = function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker
    if (infowindow.marker != marker) {
      // Clear the info window content to give the streetview time to load
      infowindow.setContent('');
      infowindow.marker = marker;

      infowindow.setContent('<div>' + marker.title + '</div>');

      infowindow.open(map, marker);

      // Make sure the marker properly is cleared if the infowindow is closed
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  };

  // This block appends our locations to a list using data-bind
  // It also serves to make the filter work
  this.myLocationsFilter = ko.computed(function() {
      var result = [];
      for (var i = 0; i < this.markers.length; i++) {
          var markerLocation = this.markers[i];
          if (markerLocation.title.toLowerCase().includes(this.searchOption()
                  .toLowerCase())) {
              result.push(markerLocation);
              this.markers[i].setVisible(true);
          } else {
              this.markers[i].setVisible(false);
          }
      }
      return result;
  }, this);
}

function initializeMapApp() {
  ko.applyBindings(new MapViewModel());
}
