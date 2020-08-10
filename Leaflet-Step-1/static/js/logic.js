var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 11
  });

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);


d3.json(url, function(response) {

    // Create a new marker cluster group
    L.geoJSON(response, {
        pointToLayer: function(feature) {
        return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
            {
            fillColor: color(+feature.properties.mag),
            weight: 1,
            fillOpacity: 0.8,
            radius: feature.properties.mag*10
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
});



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