

fetch('https://disease.sh/v3/covid-19/countries')
  .then(response => response.json())
  .then(data => {
    
    createChart(data);
  })
  .catch(error => console.error('Error fetching data:', error));


function createChart(data) {
  data.sort((a, b) => b.cases - a.cases);

  const topCountries = data.slice(0, 10);

  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(topCountries.map(d => d.country))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(topCountries, d => d.cases)])
    .nice()
    .range([height, 0]);

  const yFormat = d3.format(".0s"); 

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .attr("dx", "-0.5em")
    .attr("dy", "0.15em");

  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(yFormat)) 
    .style("font-size", "12px"); 

  svg.selectAll(".bar")
    .data(topCountries)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.country))
    .attr("y", d => y(d.cases))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.cases))
    .style("fill", "hotpink")

    
    .on("mouseover", function(event, d) {
      d3.select(this).style("fill", "lightpink");

      tooltip.style("display", "block")
        .html(`${d.country}: ${d.cases.toLocaleString()} cases`)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", "hotpink");
      tooltip.style("display", "none");
    });

  
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");
}
