//get the data and run the main function
const topologyUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const dataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const req1 = new XMLHttpRequest();
const req2 = new XMLHttpRequest();

//import the data, then run the main function
req1.open("GET", topologyUrl, true);
req1.onload = () => {
  let topoData = JSON.parse(req1.responseText);
  req2.open("GET", dataUrl, true);
  req2.onload = () => {
    let countyData = JSON.parse(req2.responseText);
    main(topoData, countyData);
  };
  req2.send();
};
req1.send();

const main = (topoData, countyData) => {
  console.log(topoData);
  console.log(countyData);
  //convert data into usable topoJson
  const convertedTopo = topojson.feature(
    topoData,
    topoData.objects.counties
  ).features;
  console.log(convertedTopo);

  const height = 650;
  const width = 950;

  //create the svg
  const map = d3
    .select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("border", "5px solid black")
    .style("border-radius", "5px")
    .style("display", "block")
    .style("margin", "auto");
  //create the tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("background-color", "lightgray")
    .style("font-size", "20px")
    .style("border-radius", "5px")
    .style("opacity", 0);
  //create the counties
  map
    .selectAll("path")
    .data(convertedTopo)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      let id = d.id;
      let match = countyData.find((element) => {
        return element["fips"] === id;
      });
      return match.bachelorsOrHigher;
    })
    .attr("fill", (d) => {
      let id = d.id;
      let matchedCounty = countyData.find((element) => {
        return element["fips"] === id;
      });
      let percentEdu = matchedCounty.bachelorsOrHigher;
      if (percentEdu < 12) {
        return "#d8ecf3";
      }
      if (percentEdu < 17) {
        return "#8ac5db";
      }
      if (percentEdu < 24) {
        return "#307f9c";
      }
      if (percentEdu > 24) {
        return "#12303b";
      }
    })
    //add in the tooltip
    .on("mouseover", (d) => {
      let id = d.id;
      let matchedCounty = countyData.find((element) => {
        return element["fips"] === id;
      });
      let percentEdu = matchedCounty.bachelorsOrHigher;
      tooltip.attr("data-education", percentEdu);
      tooltip.html(percentEdu + "%");
      tooltip.style("opacity", 0.9);
      tooltip.attr("data-fips", d.id);
      tooltip.style("position", "absolute");
      tooltip.style("left", d3.event.pageX - 10 + "px");
      tooltip.style("top", d3.event.pageY - 50 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("opacity", "0");
    });
  //create the legend
  const legend = map
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(700, 620)");
  legend
    .append("rect")
    .attr("height", 25)
    .attr("width", 50)
    .attr("fill", "#d8ecf3");
  legend.append("text").text("<12%").style("font-size", "12px");
  legend
    .append("rect")
    .attr("height", 25)
    .attr("width", 50)
    .attr("fill", "#8ac5db")
    .attr("transform", "translate(50,0)");
  legend
    .append("text")
    .text("12%-17%")
    .style("font-size", "12px")
    .attr("transform", "translate(50,0)");
  legend
    .append("rect")
    .attr("height", 25)
    .attr("width", 50)
    .attr("fill", "#307f9c")
    .attr("transform", "translate(100,0)");
  legend
    .append("text")
    .text("17%-24%")
    .style("font-size", "12px")
    .attr("transform", "translate(105,0)");
  legend
    .append("rect")
    .attr("height", 25)
    .attr("width", 50)
    .attr("fill", "#12303b")
    .attr("transform", "translate(150,0)");
  legend
    .append("text")
    .text(">24%")
    .style("font-size", "12px")
    .attr("transform", "translate(165,0)");
};
