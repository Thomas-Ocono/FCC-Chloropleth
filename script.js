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
    });
};
