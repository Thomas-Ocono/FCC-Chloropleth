const topologyUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const dataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const req1 = new XMLHttpRequest();
const req2 = new XMLHttpRequest();

const main = (topoData, data) => {
  console.log(topoData);
  console.log(data);
};

req1.open("GET", topologyUrl, true);
req1.onload = () => {
  let topoData = JSON.parse(req1.responseText);
  req2.open("GET", dataUrl, true);
  req2.onload = () => {
    let data = JSON.parse(req2.responseText);
    main(topoData, data);
  };
  req2.send();
};
req1.send();
