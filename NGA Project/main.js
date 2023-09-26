///////////////////////////////////////////////////////////////////////
////////////////////////// Main Histogram ////////////////////////////
//////////////////////////////////////////////////////////////////////


const width = 1200;
const height = 600;
const margin = { top: 50, bottom: 50, left: 70, right: 50 };

const svg = d3.select('#d3-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Define the X-axis scale
const x = d3.scaleTime()
  .domain([new Date(1900, 0), new Date(2000, 0)])
  .range([margin.left, width - margin.right]);

// Define age ranges for each decade
const ageRanges = [
  { start: 11, end: 86, lineHeight: 42 },
  { start: 8, end: 92, lineHeight: 45 },
  { start: 16, end: 83, lineHeight: 46 },
  { start: 15, end: 80, lineHeight: 55 },
  { start: 16, end: 87, lineHeight: 42 },
  { start: 17, end: 89, lineHeight: 54 },
  { start: 20, end: 91, lineHeight: 47 },
  { start: 24, end: 92, lineHeight: 60 },
  { start: 41, end: 93, lineHeight: 59 },
  { start: 50, end: 90, lineHeight: 62 }
];

// Y-axis scale to represent age ranges
const y = d3.scaleLinear()
  .domain([0, d3.max(ageRanges, d => d.end)])
  .nice()
  .range([height - margin.bottom, margin.top]);

// Y-axis label
const yAxisLabel = svg.append("g")
  .attr("transform", `translate(${margin.left - 70}, ${height / 2}) rotate(-90)`)

  yAxisLabel.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Age Range")
  .classed("y-axis-label", true);

// Horizontal grid lines
svg.selectAll(".horizontal-grid-line")
  .data(y.ticks(5)) // Adjust the number of ticks as needed
  .enter()
  .append("line")
  .attr("class", "horizontal-grid-line")
  .attr("x1", margin.left)
  .attr("x2", width - margin.right)
  .attr("y1", d => y(d))
  .attr("y2", d => y(d))
  .style("stroke", (d) => (d === 0 ? "none" : "#ccc")) // Exclude the line along the Y-axis
  .style("stroke-dasharray", (d) => (d === 0 ? "none" : "4 4")) // Optional: Add dashed line style
  .style("stroke-opacity", (d) => (d === 0 ? 0 : 0.4)); // Reduce opacity for the excluded line

// Vertical grid lines
svg.selectAll(".vertical-grid-line")
  .data(x.ticks(d3.timeYear.every(10)))
  .enter()
  .append("line")
  .attr("class", "vertical-grid-line")
  .attr("x1", d => x(d))
  .attr("x2", d => x(d))
  .attr("y1", margin.top)
  .attr("y2", height - margin.bottom)
  .style("stroke", (d) => (d.getTime() === x.domain()[0].getTime() ? "none" : "#ccc")) // Exclude the line along the X-axis
  .style("stroke-opacity", 0.4); // Adjust the opacity as needed
 
  
// Bars
const bars = svg.selectAll("rect")
  .data(ageRanges)
  .enter()
  .append("rect")
  .attr("x", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2;
  })
  .attr("width", (width - margin.left - margin.right) / (ageRanges.length * 2))
  .attr("y", d => y(d.end))
  .attr("height", d => y(d.start) - y(d.end))
  .style("fill", "url(#gradient)") // Apply the gradient fill
  .attr("rx", 30)
  .attr("ry", 30);

// Linear gradient for the bars
svg.append("linearGradient")
  .attr("id", "gradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", y(0))
  .attr("y2", y(d3.max(ageRanges, d => d.end)))
  .selectAll("stop")
  .data([
    { offset: "0%", color: "#FFF800" }, // Start color
    { offset: "100%", color: "#3780D7" } // End color
  ])
  .enter()
  .append("stop")
  .attr("offset", d => d.offset)
  .attr("stop-color", d => d.color);

// Group the lines
const linesGroup = svg.append("g")
  .attr("class", "lines-group");

// Median Lines
svg.selectAll(".age-line")
  .data(ageRanges)
  .enter()
  .append("line")
  .attr("class", "age-line")
  .attr("x1", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2;
  })
  .attr("x2", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2 + barWidth;
  })
  .attr("y1", d => y(d.lineHeight)) // Start at the specified lineHeight on the Y-axis
  .attr("y2", d => y(d.lineHeight)) // End at the specified lineHeight on the Y-axis
  .style("stroke", "white") // Line color
  .style("stroke-width", 4); // Line width


// Circles
svg.selectAll("circle.top")
  .data(ageRanges)
  .enter()
  .append("circle")
  .attr("class", "top") // Class for top circles
  .attr("cx", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2 + (barWidth / 2);
  })
  .attr("cy", d => y(d.end) + 22) // Position at the top of the bar
  .attr("r", 15) // circle radius
  .style("fill", "black")
  .style("stroke", "#D7D7D7") 
  .style("stroke-width", 3); 

svg.selectAll("circle.bottom")
  .data(ageRanges)
  .enter()
  .append("circle")
  .attr("class", "bottom") // Class for bottom circles
  .attr("cx", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2 + (barWidth / 2);
  })
  .attr("cy", d => y(d.start) - 22) // Position at the bottom of the bar
  .attr("r", 15) // Circle radius
  .style("fill", "#D7D7D7") 
  .style("stroke", "black") 
  .style("stroke-width", 3); 

// Add text labels for maximum ages inside the top circles
svg.selectAll("text.top-label")
  .data(ageRanges)
  .enter()
  .append("text")
  .attr("class", "top-label")
  .attr("x", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2 + (barWidth / 2);
  })
  .attr("y", d => y(d.end)) // Position text in the center vertically
  .attr("text-anchor", "middle") // Center text horizontally
  .attr("dy", "2.2em") // Adjust vertical position for centering
  .attr("fill", "#fff")
  .text(d => d.end); // Display the maximum age value in the top circles

// Add text labels for minimum ages inside the bottom circles
svg.selectAll("text.bottom-label")
  .data(ageRanges)
  .enter()
  .append("text")
  .attr("class", "bottom-label")
  .attr("x", (d, i) => {
    const barWidth = (width - margin.left - margin.right) / (ageRanges.length * 2);
    const ageRangeWidth = (width - margin.left - margin.right) / ageRanges.length;
    return margin.left + (i * ageRangeWidth) + (ageRangeWidth - barWidth) / 2 + (barWidth / 2);
  })
  .attr("y", d => y(d.start)) // Position text in the center vertically
  .attr("text-anchor", "middle") // Center text horizontally
  .attr("dy", "-1.4em") // Adjust vertical position for centering
  .attr("fill", "#000")
  .text(d => d.start); // Display the minimum age value in the bottom circles


function yAxis(g) {
  g.attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0f')))
    .attr("font-size", '20px');
}

function xAxis(g) {
  g.attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(10)).tickSize(10).tickFormat(d3.timeFormat('%Y')))
    .attr("font-size", '20px');
}

svg.append("g").call(xAxis).attr("class", "x-axis");
svg.append("g").call(yAxis).attr("class", "y-axis");

///////////////////////////////////////////////////////////////////////
/////////////////// Sample Size Bar Chart ////////////////////////////
//////////////////////////////////////////////////////////////////////

// Dimensions and margins for the bar chart
const barChartWidth = 1200;
const barChartHeight = 200;
const barChartMargin = { top: 10, bottom: 10, left: 70, right: 50 };

// Separate SVG container for the bar chart
const barChartSvg = d3.select('#d3-container')
  .append('svg')
  .attr('width', barChartWidth)
  .attr('height', barChartHeight);

// Vertical flip to the bar chart within the SVG container
barChartSvg.style('transform', 'scaleY(-1)');

// Data
const barChartData = [
  { category: 'Category a', value: 2099 },
  { category: 'Category b', value: 3493 },
  { category: 'Category c', value: 5751 },
  { category: 'Category d', value: 8317 },
  { category: 'Category e', value: 7500 },
  { category: 'Category f', value: 7703 },
  { category: 'Category g', value: 7200 },
  { category: 'Category h', value: 3138 },
  { category: 'Category i', value: 1729 },
  { category: 'Category j', value: 1097 },
];

console.log(barChartData);

// X and Y scales for the bar chart
const barX = d3.scaleBand()
  .domain(barChartData.map(d => d.category))
  .range([barChartMargin.left, barChartWidth - barChartMargin.right])
  .padding(0.1);

const barY = d3.scaleLinear()
  .domain([0, d3.max(barChartData, d => d.value)])
  .nice()
  .range([barChartHeight - barChartMargin.bottom, barChartMargin.top]);

// Sort the data by category in ascending order
barChartData.sort((a, b) => d3.ascending(a.category, b.category));

// Bars for bar chart
const barChartBars = barChartSvg.selectAll("rect")
  .data(barChartData)
  .enter()
  .append("rect")
  .attr("x", (d, i) => barX(d.category))
  .attr("y", d => barY(d.value)) // 
  .attr("width", barX.bandwidth())
  .attr("height", d => barY(0) - barY(d.value)) // Height based on the value
  .style("fill", "#AEAEAE"); // Bar Color


// Label to the left of the chart
const barChartYAxisLabel = barChartSvg.append("g")
  .attr("transform", `translate(${barChartMargin.left - 65}, ${barChartHeight / 2}) rotate(-90)`);

barChartYAxisLabel.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Collection Count")
  .classed("y-axis-label", true)
  .attr("transform", "scale(-1, 1)"); 
