/* for now we can just select a specific county, 
for testing purposes change this variable and see if your graphs change */

var selectedCounty = "ALAMEDA";

var californiaCenter = [36.78, -119.42];
var baseZoom = 6;
var file_path1 = "../static/data/CA_Crime.csv";
var file_path2 = "../static/data/census_data.csv";

// Build dropdown menu
crimes = [
    "Simple Assault",
    "Robbery",
    "Rape",
    "Murder/ Non-negligent Manslaughter",
    "Negligent Manslaughter",
    "Sex Offences",
    "Aggravated Assault"
];

d3.select("#Crimes")
    .selectAll("inserted-option")
    .data(crimes)
    .enter()
    .append("option")
    .text(d => d);

// Connect data

// Attempt 2: Tried to switch to grouping numbers by county so we could use the population numbers. 
// However, we do not have lat and lon for the counties. While one can be selected from the city list (perhaps
// one with highest crime numbers)
Promise.all([
    d3.csv(file_path1),
    d3.csv(file_path2),
]).then(function(data) {
    // filter the data to remove N/A values
    var cleanedData = data[0].filter(removeNA);
    var groupedData = d3.nest()
    .key(d => d.County)
    .rollup(function(d) {
        return {
        simpAssult: d3.sum(d, function(e) {return e.Simp_Assult;}),
        robbery: d3.sum(d, function(e) {return e.Robbery;}),
        rape: d3.sum(d, function(e) {return e.Rape;}),
        murderAndNonnegMan: d3.sum(d, function(e) {return e.Murder_and_Nonneg_Man;}),
        manslaughterNeg: d3.sum(d, function(e) {return e.Manslaughter_Neg;}),
        sexOffences: d3.sum(d, function(e) {return e.Sex_Offences;}),
        aggAssult: d3.sum(d, function(e) {return e.Agg_Assult;}),
        };
    })
    .entries(cleanedData);
    
    console.log(data[1]);
    var population = {};
    data[1].forEach(d => {
        d.County = d.County.toUpperCase();
        d.Population = +d.Population;
        population[`${d.County}`] = d.Population;
    });
    console.log(population);

    // Selecting lat and lon based on highest crime number per city
    let coordinates = [];
    let lat = +cleanedData[0].Lat;
    let lon = +cleanedData[0].Lon;
    let offences = +cleanedData[0].Offences_Total

    for (i=1; i<cleanedData.length; i++) {
        cleanedData[i].Lat = +cleanedData[i].Lat;
        cleanedData[i].Lon = +cleanedData[i].Lon;
        cleanedData[i].Offences_Total = +cleanedData[i].Offences_Total;
        if (cleanedData[i].County !== cleanedData[i-1].County) {
            coordinates.push([lat, lon]);
            lat = cleanedData[i].Lat;
            lon = cleanedData[i].Lon;
            offences = cleanedData[i].Offences_Total;
        }
        else if (cleanedData[i].Offences_Total > offences) {
            lat = cleanedData[i].Lat;
            lon = cleanedData[i].Lon;
        }
        else {continue}
    }
    coordinates.push([lat, lon]);

    console.log(coordinates);
});



// Using Police Department Lat and Lon. Problem with this 
// method is we do not have population numbers for each area. 
// Crime totals range from 0 to over 16,000, making normalization difficult.

// Uncomment below to see heatmap (not very meaningful)
// d3.csv(file_path1).then(function(data) {
//     let cleanedData = data.filter(removeNA);

//     let crimeLocations = [];
//     let totalCrimes = [];
//     cleanedData.forEach(city => {
//         city.Agg_Assult = +city.Agg_Assult;
//         city.Sex_Offences = +city.Sex_Offences;
//         city.Manslaughter_Neg = +city.Manslaughter_Neg;
//         city.Murder_and_Nonneg_Man = +city.Murder_and_Nonneg_Man;
//         city.Rape = +city.Rape;
//         city.Robbery = +city.Robbery;
//         city.Simp_Assult = +city.Simp_Assult;
//         city.Offences_Total = +city.Offences_Total;
//         city.Lat = +city.Lat;
//         city.Lon = +city.Lon;

//         if (city.Lat != 0) {
//             crimeLocations.push([city.Lat, city.Lon]);
//             totalCrimes.push(city.Offences_Total);
//         }
//     });

//     let minRange = d3.min(totalCrimes);
//     let maxRange = d3.max(totalCrimes);

//     let intensities = [];

//     totalCrimes.forEach(city => {
//         return intensities.push(normalizeValue(city, maxRange, minRange))
//     });

//     let mapInputs = [];
//     for (i = 0; i < crimeLocations.length; i++) {
//         crimeLocations[i].push(intensities[i]);
//     }

//     console.log(crimeLocations);

//     buildMap(crimeLocations);
// });

function buildMap(data) {
    // create map, center on CA
    var heatMap = L.map("graph-two", {
        center: californiaCenter,
        zoom: baseZoom
    });

    // Add tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    }).addTo(heatMap);

    // Add heat layer
    L.heatLayer(data, {
        max: 0.002,
        radius: 100,
    }).addTo(heatMap);
};

function removeNA(data) {
    return data.Offences_Total != "N/A";
};

function normalizeValue(val, max, min) { 
    return (val - min) / (max - min); 
};
