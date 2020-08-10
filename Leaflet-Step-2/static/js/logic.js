var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var url_2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


//Select map title layers
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "satellite-streets-v11",
    accessToken: API_KEY
});

var grayScalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "light-v10",
    accessToken: API_KEY
  });

var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Satelite": satelliteMap,
    "Grayscale": grayScalemap,
    "Outdoor": outdoorMap
    };

var myMap = L.map("map", {
    center: [34.05, -118.24],
    zoom: 5,
    layers: [satelliteMap]
})

//Create a control layer
var controlLayers=L.control.layers(baseMaps, {}, {
    collapsed:false
}).addTo(myMap);


d3.json(url, function(response) {

    // Create a new marker cluster group
    var earthquakeData = L.geoJSON(response, {
        pointToLayer: function(feature) {
        return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
            {
            fillColor: color(+feature.properties.mag),
            weight: 1,
            fillOpacity: 0.8,
            radius: feature.properties.mag * 2
            });
        }
    })
    .bindPopup(function (layer) {
        return ("<h3>" 
        + layer.feature.properties.place +
        "</h3><hr><p>" 
        + "Magnitude of the Earthquake: " + layer.feature.properties.mag + 
        "</p><p>" 
        + new Date(layer.feature.properties.time) +
        "</p>");
    }).addTo(myMap);

    controlLayers.addOverlay(earthquakeData, "Earthquakes")
});

d3.json(url_2, function(response){

    var geoPlates = L.geoJSON(response,{
       style: {
         color: "yellow",
         weight: 2,
       }
     }).addTo(myMap);
  
       controlLayers.addOverlay(geoPlates, "Tectonic Plates");
   
   });

  // Set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + color(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
    
  legend.addTo(myMap);

function color(magnitude){
if (magnitude > 5){
    return "#FF0000";
}
else if (magnitude > 4){
    return "#FFA500";
}
else if (magnitude > 3){
    return "#ffd700";
}
else if (magnitude > 2){
    return "#FFFF00";
}
else if (magnitude > 1){
    return "#9ACD32";
}
else {
    return "#ADFF2F"
}
};