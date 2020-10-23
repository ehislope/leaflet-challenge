var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl).then(EqData => {
    console.log(EqData);

    // let geojson = L.choropleth(Eqdata, {

    //     // Define what  property in the features to use
    //     valueProperty: geometry.coordinates[2],
    
    //     // Set color scale
    //     scale: ["#ffffb2", "#b10026"],
    
    //     // Number of breaks in step range
    //     steps: 10,
    
    //     // q for quartile, e for equidistant, k for k-means
    //     mode: "q",
    //     style: {
    //       // Border color
    //       color: "#fff",
    //       weight: 1,
    //       fillOpacity: 0.8
    //     };
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(EqData.features);
  });

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>"  + "Magnatude: " + feature.properties.mag+
        "</p><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>" +
        "</p><hr><p>" + "Location: " + feature.properties.place);
    }
    
    
// var earthquakes = L.geoJSON(earthquakeData, {
//         onEachFeature: onEachFeature,
//       });
      
var mags = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
        return new L.Circle(latlng, {
          radius: feature.properties.mag*20000,
          fillColor: feature.geometry.coordinates[2],
          stroke: false 
        });
    }
});
    
// Sending our earthquakes layer to the createMap function
createMap(mags);
}



function createMap(mags) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Magnitudes: mags
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        14.60,-28.67
      ],
      zoom: 2,
      layers: [streetmap, mags]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    // Set up the legend
//   var legend = L.control({ position: "bottomleft" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = `<h1>Median Income</h1>
//       <div class="labels">
//         <div class="min"> ${limits[0].toLocaleString(undefined,{style:'currency',currency:'USD',maximumSignificantDigits: 3})} </div>
//         <div class="max"> ${limits[limits.length - 1].toLocaleString(undefined,{style:'currency',currency:'USD',maximumSignificantDigits: 4})} </div>
//       </div>`;

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);
  }