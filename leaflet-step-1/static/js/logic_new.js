var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

function getColor(depth) {
  if (depth > 90) {
    return  '#253494'
  } else if (depth > 80){
    return '#2c7fb8'
  } else if(depth > 60){
    return '#41b6c4'
  } else if (depth > 40){
    return '#7fcdbb'
  } else if (depth > 20) {
    return '#c7e9b4'
  } else {
    return '#ffffcc'};
}

        // Perform a GET request to the query URL
d3.json(queryUrl).then(EqData => {
  console.log(EqData);

    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(EqData.features);
  });

  function createFeatures(earthquakeData) {

    var mags = L.geoJSON(earthquakeData, {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
   onEachFeature : function (feature, layer) {
  
      layer.bindPopup("<p>" + "Magnitude: " + feature.properties.mag +
        "</p><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + 
        "</p><hr><p>" + "Location: " + feature.properties.place);
      },     pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
          {radius: feature.properties.mag*50000,
          fillColor: getColor(feature.geometry.coordinates[2]),
          fillOpacity: .75,
          color: "gray",
          stroke: true,
          weight: 0.5
      })
    }
    });
      
  
  
    // Sending our earthquakes layer to the createMap function
    createMap(mags);
  }

function createMap(mags) {

    // Define streetmap and darkmap layers
    var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMap = {
      "Gray Map": graymap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMap = {
      Magnitudes: mags
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        14.60,-28.67
      ],
      zoom: 3,
      layers: [graymap, mags]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMap, overlayMap, {
      collapsed: false
    }).addTo(myMap);
 
  var legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 20, 40, 60, 80, 90];
    var colors = [
      '#ffffcc',
      '#c7e9b4',
      '#7fcdbb',
      '#41b6c4',
      '#2c7fb8',
      '#253494'
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);
}
