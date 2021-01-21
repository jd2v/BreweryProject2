// outside references used for this code:
// https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
// https://bl.ocks.org/SpaceActuary/6233700e7f443b719855a227f4749ee5

// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
// var svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", 800)
  .attr("width", 960);


// Parse the Data
d3.csv("FinalCountyDemographicsRGed.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1);
  console.log(subgroups);

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d) {return(d.edBins)}).keys();
  console.log(groups);

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2]);
  svg.append("g")
    .attr("transform", "translate(50," + height+25 + ")")
    .call(d3.axisBottom(x));
    console.log(x);

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 2600])
    .range([ height, 0 ]);
  svg.append("g")
  .attr("transform", "translate(50," + 25 + ")")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#ffa535", "#ffe755", "#871282", "#afb4ff"]);

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)(data);

    var barSpacing = 10; // desired space between each bar
    var chartWidth = width - margin.left - margin.right;
    var barWidth = (chartWidth - (barSpacing * (7))) / 8;

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.edBins); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", d => barWidth)
        .attr("transform", "translate(45," + 25 + ")");
    
    // svg.append("g")
    // .attr("transform", "translate(0,600)")
    // .call(d3.axisBottom(d3.scalePoint().domain(groups).range([width/16,width-(width/16)])))

});
