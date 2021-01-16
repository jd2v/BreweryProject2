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
  iconUrl: '/Resources/beerMug.png',
  iconSize:     [40, 50] ,
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76] 
});
//Create clustered pub markers
var breweriesLayer = L.markerClusterGroup();
// Load in data on breweries
d3.csv("/Resources/breweries_v1.csv", function(data) {
  //Makes popups and pushes them to breweriesLayer
  data.forEach(pub => {
    breweriesLayer.addLayer(
      L.marker([pub.Latitude, pub.Longitude], {icon: mugIcon}).bindPopup("<h3>" + pub.BreweryName + "</h3> <hr> <h3>Type: " + pub.BreweryType + "</h3>")
      );
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

//To make education chloropleth
d3.json(geoData, data => {
  geojsonEducation = L.choropleth(data, {

   // Define what  property in the features to use
    valueProperty: "bach_deg_pct_14to18",

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
   layer.bindPopup("County Name: " + feature.properties.NAME + "<br>Bachelor degree(%):<br>" +
      feature.properties.bach_deg_pct_14to18 + "%")
 }}).addTo(myMap);


var baseMaps = {
  Income: geojsonIncome,
  Education: geojsonEducation
};

// Makes overlay object controls
var overlays = {
  Breweries: breweriesLayer
};

// Adds layer control
L.control.layers(baseMaps, overlays).addTo(myMap);  
});

// Creating map object
var myMap = L.map("map", {
  center: [39.833, -98.583],
  zoom: 5,
  layers: [lightmap , breweriesLayer]
});
