// creating tile layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

//custom icons
var mugIcon = L.icon({
  iconUrl: '/static/img/beerMug.png',
  iconSize:     [40, 50] ,
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76] 
});
var canIcon = L.icon({
  iconUrl: '/static/img/can.png',
  iconSize:     [40, 40] ,
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76] 
});
var kegIcon = L.icon({
  iconUrl: '/static/img/keg.png',
  iconSize:     [40, 50] ,
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76] 
});
var bottleIcon = L.icon({
  iconUrl: '/static/img/bottle.png',
  iconSize:     [40, 50] ,
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76] 
});
//Create clustered pub markers
var allBreweriesLayer = L.markerClusterGroup();
var brewPubLayer = L.markerClusterGroup();
var microLayer = L.markerClusterGroup();
var regionalLayer = L.markerClusterGroup();
var contractLayer = L.markerClusterGroup();
var bestLayer = L.markerClusterGroup();
var largestLayer = L.markerClusterGroup();

// Load in data on breweries
d3.csv("/Resources/breweries_v2.csv", function(data) {
  //Makes popups and pushes them to breweriesLayer
  data.forEach(pub => {
    if (pub.BestList == "TRUE") {
      bestLayer.addLayer(
        L.marker([pub.Latitude, pub.Longitude], {icon: mugIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      )}
    if (pub.LargestList == "TRUE") {
      largestLayer.addLayer(
        L.marker([pub.Latitude, pub.Longitude], {icon: kegIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      )}
    allBreweriesLayer.addLayer(
      L.marker([pub.Latitude, pub.Longitude], {icon: mugIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      );
    if (pub.BreweryType == "brewpub" || pub.BreweryType == "bar") {
      brewPubLayer.addLayer(
        L.marker([pub.Latitude, pub.Longitude], {icon: mugIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      )}
    else if (pub.BreweryType == "regional" || pub.BreweryType == "large"){
      regionalLayer.addLayer(
        L.marker([pub.Latitude, pub.Longitude], {icon: kegIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      )
    }
    else if (pub.BreweryType == "micro" || pub.BreweryType == "closed"){
      microLayer.addLayer(
        L.marker([pub.Latitude, pub.Longitude], {icon: canIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      )
    }
    else {
      contractLayer.addLayer(
        L.marker([pub.Latitude, pub.Longitude], {icon: bottleIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      )
    }
  });
});

//Adds chloropleth data bach_deg_pct_14to18
var geoData = "/Resources/final_counties.geojson";
var geojsonIncome;
var geojsonEducation;
var incomeLayer = L.layerGroup(geojsonIncome);
var educationLayer = L.layerGroup(geojsonEducation);

// Grab geojson data to make income chloropleth
d3.json(geoData, data => {
 geojsonIncome = L.choropleth(data, {

   // Define what  property in the features to use
    valueProperty: "median_HHI_2019",

 // Set color scale
 scale: ["white", "purple"],

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

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojsonIncome.options.limits;
  var colors = geojsonIncome.options.colors;
  var labels = [];

  // Add min & max
  var legendInfo = "<h1>Median Income</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);

});

//To make education chloropleth
d3.json(geoData, data => {
  geojsonEducation = L.choropleth(data, {

   // Define what  property in the features to use
    valueProperty: "bach_deg_pct_14to18",

 // Set color scale
 scale: ["white", "green"],

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
   layer.bindPopup("County Name: " + feature.properties.NAME + "<br>Bachelor degree(%):<br>" +
      feature.properties.bach_deg_pct_14to18 + "%")
 }}).addTo(myMap);

 // Set up the legend
 var legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   var limits = geojsonEducation.options.limits;
   var colors = geojsonEducation.options.colors;
   var labels = [];

   // Add min & max
   var legendInfo = "<h1>Bachelor degrees %</h1>" +
     "<div class=\"labels\">" +
       "<div class=\"min\">" + limits[0] + "</div>" +
       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
     "</div>";

   div.innerHTML = legendInfo;

   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding legend to the map
 legend.addTo(myMap);


var baseMaps = {
  Income: geojsonIncome,
  Education: geojsonEducation
};

// Makes overlay object controls
var overlays = {
  "All Breweries(clustered)": allBreweriesLayer,
  "Regional Breweries": regionalLayer,
  "Micro Breweries": microLayer,
  "BrewPubs": brewPubLayer,
  "Contract Breweries": contractLayer,
  "Largest Breweries": largestLayer,
  "Best Reviewed Breweries": bestLayer
};

// Adds layer control
L.control.layers(baseMaps, overlays).addTo(myMap);  
});

// Creating map object
var myMap = L.map("map", {
  center: [39.833, -98.583],
  zoom: 5,
  layers: [lightmap , allBreweriesLayer]
});