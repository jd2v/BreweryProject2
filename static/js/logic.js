// Creating map object
var myMap = L.map("map", {
    center: [39.833, -98.583],
    zoom: 5,
    // layers: [/*incomeLayer, educationLayer,*/ light]
  });
  
  // Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
//custom icons
  var mugIcon = L.icon({
    iconUrl: '/Resources/beerMug.png',
    iconSize:     [40, 50] ,
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76] 
  });
// Load in data on breweries
d3.csv("/Resources/breweries_v1.csv", function(data) {
//Create clustered pub markers
var pubMarkers = L.markerClusterGroup();
//Still have to change .location, .descriptor, and .coordinates to match data source
data.forEach(pub => {
    pubMarkers.addLayer(L.marker([pub.Latitude, pub.Longitude], {icon: mugIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>"))
});
//Adds pub markers to map
myMap.addLayer(pubMarkers);
});
//Adds chloropleth data bach_deg_pct_14to18
var geoData = "/Resources/final_counties.geojson";
var geojson;
// Grab geojson data
d3.json(geoData, data => {
  geojson = L.choropleth(data, {

   // Define what  property in the features to use
    valueProperty: "median_HHI_2019",

 // Set color scale
 scale: ["#ffffb2", "#b10026"],

 // Number of breaks in step range
 steps: 8,

 // q for quartile, e for equidistant, k for k-means
 mode: "q",
 style: {
   // Border color
   color: "#fff",
   weight: 1,
   fillOpacity: 0.8
 },

 // Binding a pop-up to each layer
 onEachFeature: function(feature, layer) {
   layer.bindPopup("County Name: " + feature.properties.NAME + "<br>Median Household Income:<br>" +
     "$" + feature.properties.median_HHI_2019);
 }
}).addTo(myMap);


});
// Define Various Layers
// var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "light-v10",
//   accessToken: API_KEY
// });



// //Adds BaseLayers
// var baseMaps = {
//   Light: light
// };

// // Adds optional layers
// var overlayMaps = {
// //  Income: incomeLayer,
// //  Education: educationLayer,
//  Breweries: pubMarkers
// };

// //Adds layer control
// L.control.layers(baseMaps, overlayMaps).addTo(myMap)