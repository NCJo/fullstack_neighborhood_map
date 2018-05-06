// TODO: None

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

// Set to global scope to prevent error
var map;

function MapViewModel() {
  var self = this;
  // From search bar in the main page to filter out some markers
  this.filterOption = ko.observable("");
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

      this.marker.addListener('click', function() {
        // This centering method works somehow...
        map.setCenter(this.getPosition());
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        // Marker will stop bouncing after 5 seconds
        setTimeout(function() {
          this.setAnimation(null);
        }.bind(this), 5000);
      })

    }
  };
  this.initMap();

  // This function populates the infowindow when the marker is clicked. We'll only allow one infowindow  which will open at the marker that is clicked, and populate based on that markers position
  // Put all the third party APIs in this function for it to show in the info window when click
  this.populateInfoWindow = function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker
    if (infowindow.marker != marker) {
      // Clear the info window content to give the streetview time to load
      infowindow.setContent('');
      infowindow.marker = marker;
      // Setting up URL for Wikipedia request
      var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + marker.title
      // Get data from Wikipedia API
      $.ajax( {
        url: wikiURL,
        // Need to use jsonp not json for it to work
        dataType: 'jsonp',
        type: 'POST',
        headers: { 'Api-User-Agent': 'Example/1.0' },
        success: function(data) {
          poiTitle = data[0];
          poiDescription = data[2].shift();
          poiURL = data[3].shift();
          htmlShowInfo = '<h6 class="text-danger">' + poiTitle + '</h6>' + '<br>' +
                        '<h8 class="text-secondary">' + marker.address + '</h8>' + '<br>' + '<br>' +
                        '<h8 class="text-success">' + poiDescription + '</h8>' + '<br>' + '<br>' +
                        '<h8>' + '<a href='+ poiURL + '>' + poiURL + '</a>' + '</h8>';
          infowindow.setContent(htmlShowInfo);

        }
      }).fail(function() {
        // Tell user about the error
        alert("There was an error getting Wikipedia API.");
      });

      infowindow.open(map, marker);

      // Make sure the marker properly is cleared if the infowindow is closed and animation is stopped
      infowindow.addListener('closeclick', function() {
        infowindow.marker.setAnimation(null);
        infowindow.marker = null;

      });
    }
  };

  // Function for interaction with marker from the navbar
  this.selectMarkerFromSideNav = function() {
    // This map centering method works somehow...
    map.setCenter(this.getPosition());
    self.populateInfoWindow(this, self.largeInfoWindow);
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      this.setAnimation(null);
    }.bind(this), 5000)
  };

  // This block appends our locations to a list using data-bind
  // It also serves to make the filter work
  this.locationsFilter = ko.computed(function() {
      var filteredResult = [];
      for (var i = 0; i < this.markers.length; i++) {
          var markerLocation = this.markers[i];
          if (markerLocation.title.toLowerCase().includes(this.filterOption()
                  .toLowerCase())) {
              filteredResult.push(markerLocation);
              this.markers[i].setVisible(true);
          } else {
              this.markers[i].setVisible(false);
          }
      }
      return filteredResult;
  }, this);
}

// Initialize the function
function initializeMapApp() {
  ko.applyBindings(new MapViewModel());
}
