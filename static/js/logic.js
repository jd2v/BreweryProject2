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

//Create scatterplot
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 2440 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("/Resources/BreweryProject2-RGbranch/countydemographicsv1.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 155000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 90])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#scatter")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")



  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("The County name is:" + d.area_name)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data.filter(function(d,i){return i<3074})) // the .filter part is just to keep a few dots on the chart, not all of them
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.median_HHI_2019); } )
      .attr("cy", function (d) { return y(d.bach_deg_pct_14to18); } )
      .attr("r", 10)
      .style("fill", "#69b3a2")
      .style("opacity", 0.3)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )

})