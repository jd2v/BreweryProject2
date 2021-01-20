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
d3.csv("/Resources/FinalCountyDemographics.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([35000, 155000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([10, 80])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Adds a tooltip div
  var tooltip = d3.select("#scatter")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color",  "rgb(102, 207, 88)")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  // A function that changes this tooltip when the user hover a point.
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("The area is " + d.area_name + " and it has " + Math.floor(d.Brewery_Count) + " Breweries")
      .style("left", (d3.mouse(this)[0]) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.median_HHI_2019); } )
      .attr("cy", function (d) { return y(d.bach_deg_pct_14to18); } )
      .attr("r", function (d) { return (d.Brewery_Count); })
      .style("fill", "blue")
      .style("opacity", 0.5)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
})