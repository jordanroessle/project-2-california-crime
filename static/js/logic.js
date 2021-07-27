// global variables
var californiaCenter = [36.78, -119.42];
var baseZoom = 6;
var queryUrl = "../static/data/CA_Counties.geojson";
var displayGraphs;

// define layers
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "satellite-v9",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
});

// define basemap object to hold base layers
var baseMaps = { 
    "Outdoor Map": outdoormap,
    "Satellite Map": satellitemap,
    "Dark Map": darkmap,  
    "Light Map": lightmap,
};

// declare countyLines so that we can create the map before giving features to counties
var countyLines =  new L.LayerGroup()

// define overlay maps
var overlayMaps = {
    "County Lines": countyLines
};

// create map, center on US
var myMap = L.map("map", {
    center: californiaCenter,
    zoom: baseZoom, 
    layers: [outdoormap, countyLines]
});

// read json
d3.json(queryUrl).then(function(data) {
    filteredFeatures = filterOutIslands(data.features);
    dropDownOptions(filteredFeatures);
    createFeatures(filteredFeatures, myMap).addTo(countyLines);
});

// Create layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// gives features to every county layer
function createFeatures(countyData, myMap) {
    function onEachFeature(feature, layer) {
        layer.on({
            click: function(event) {
                myMap.flyToBounds(event.target.getBounds());
                updateDropDown(event.target.feature.properties.COUNTY_NAME);
                d3.select(".header").text(event.target.feature.properties.COUNTY_NAME + " County");
                displayGraphs(event.target.feature.properties.COUNTY_NAME);
            }
        })
        layer.bindPopup("<h3>" + feature.properties.COUNTY_NAME + "</h3>")
    }
    var countyLines = L.geoJSON(countyData, {
        onEachFeature: onEachFeature
    });
    return countyLines;
}

// gives drop down menu list of counties
function dropDownOptions(data) {
        d3.select("#Counties")
            .selectAll("inserted-option")
            .data(data)
            .enter()
            .append("option")
            .text(d => d.properties.COUNTY_NAME);       
}

// resets the map to original state
function recenterMap() {
    // fly map to center
    myMap.flyTo(californiaCenter, baseZoom);
    // close popups
    myMap.closePopup();
    // reset header
    d3.select(".header").text("Please select a County");
    // reset dropdown
    d3.select("#Counties").selectAll("option").nodes()[0].selected = true;
    // remove existing plots
    d3.select("#graph-one").html("");
    d3.select("#graph-two").html("");
}

// updates map based on option chosen from drop down
function dropDownChanged(chosenCounty) {
    // if All is chosen, reset the map
    if(chosenCounty === "All") {
        recenterMap();
    }
    // otherwise, find the layer containing the county and center the map on that
    else {
        // update header
        d3.select(".header").text(chosenCounty + " County");
        // update map
        var layerKeys = Object.keys(myMap._layers);
        // removes last layer that has a key that changes 
        layerKeys.pop();
        layerKeys.forEach(key => {
            if(myMap._layers[key].feature) {
                if(myMap._layers[key].feature.properties.COUNTY_NAME === chosenCounty) {
                    myMap.flyToBounds(myMap._layers[key].getBounds());
                    myMap._layers[key].openPopup();
                }
            }
        });
        // display graphs
        displayGraphs(chosenCounty);
    }
}

// update down when map is clicked 
function updateDropDown(chosenCounty) {
    // select all options
    var options = d3.select("#Counties").selectAll("option").nodes();
    // remove "All" selection
    options.shift();
    // change selected to true if county names match
    options.forEach(option => {
        if(option.__data__.properties.COUNTY_NAME === chosenCounty) {
            option.selected = true;
        }
    })
}

// removes some features from geojson
function filterOutIslands(features) {
    /*
        Santa Barbara 58-62
        Ventura 63-66
        Los Angeles 67-68
    */
    // removes islands under these three counties
    features.splice(58, 11);
    return features;
}   
     
        

d3.json("http://127.0.0.1:5000/api/v1.0/crimes").then(function(crimeData) {
    d3.json("http://127.0.0.1:5000/api/v1.0/demographics").then(function(demoData) {        

        displayGraphs = function displayGraphs(chosenCounty) {
            // remove existing plots if they exist
            d3.select("#graph-one").html("");
            d3.select("#graph-two").html("");

            // filter data based on selectedCounty 
            filteredDemo = demoData.filter(data => data.County === chosenCounty);
            filteredCrime = crimeData.filter(data => data.County === chosenCounty.toUpperCase());
            
            // find total population
            filteredDemo.Population = +filteredDemo.Population
            population = filteredDemo[0].Population

            // Variables to store total crime numbers
            var aggAssult = 0;
            var sexOffences = 0;
            var manslaughterNeg = 0;
            var murderAndNonnegMan = 0;
            var rape = 0;
            var robbery = 0;
            var simpAssult = 0;
            var offencesTotal = 0;

            filteredCrime.forEach(city => {
                // Cast each crime value to a number
                city.Agg_Assult = +city.Agg_Assult;
                city.Sex_Offences = +city.Sex_Offences;
                city.Manslaughter_Neg = +city.Manslaughter_Neg;
                city.Murder_and_Nonneg_Man = +city.Murder_and_Nonneg_Man;
                city.Rape = +city.Rape;
                city.Robbery = +city.Robbery;
                city.Simp_Assult = +city.Simp_Assult;
                city.Offences_Total = +city.Offences_Total;
        
                // Add each crime number to total if it is not NaN
                if(city.Agg_Assult) {
                    aggAssult += city.Agg_Assult;
                }
                if(city.Sex_Offences) {
                    sexOffences += city.Sex_Offences;
                }
                if(city.Manslaughter_Neg) {    
                    manslaughterNeg += city.Manslaughter_Neg;
                }
                if(city.Murder_and_Nonneg_Man) {
                    murderAndNonnegMan += city.Murder_and_Nonneg_Man;
                }
                if(city.Rape) {
                    rape += city.Rape;
                }
                if(city.Robbery) {
                    robbery += city.Robbery;
                }
                if(city.Simp_Assult) {
                    simpAssult += city.Simp_Assult;
                }
                if(city.Offences_Total) {
                    offencesTotal += city.Offences_Total;
                }
            });
            
            crimes = {
                "Simple Assault": simpAssult,
                "Robbery": robbery,
                "Rape": rape,
                "Murder/ Non-negligent Manslaughter": murderAndNonnegMan,
                "Negligent Manslaughter": manslaughterNeg,
                "Sex Offences": sexOffences,
                "Aggravated Assault": aggAssult
            };
        
            crimesPer100k = {
                "Simple Assault": per100k(simpAssult, population),
                "Robbery": per100k(robbery, population),
                "Rape": per100k(rape, population),
                "Murder/ Non-negligent Manslaughter": per100k(murderAndNonnegMan, population),
                "Negligent Manslaughter": per100k(manslaughterNeg, population),
                "Sex Offences": per100k(sexOffences, population),
                "Aggravated Assault": per100k(aggAssult, population)
                };
        
            crimePercentage = [];
        
            Object.values(crimes).forEach(c => {
                let percentage = (c/offencesTotal*100).toFixed(2);
                let percentageString = `${percentage}%`
                crimePercentage.push(percentageString) 
            });
            
            var values = Object.values(crimesPer100k);
            var labels = Object.keys(crimesPer100k);
        
            var data = [{
                type: "bar",
                x: values,
                y: labels,
                orientation: "h",
                text: crimePercentage,
                textposition: "auto",
                marker: {
                    color: ["#0000CD", "#3CB371", "#9932CC", "#FFD700", "#FF4500", "#FF1493", "#DC143C"]
                }
            }];
        
            var layout = {
                title: `Crime breakdown for ${chosenCounty}`,
                xaxis: {
                    title: "Crime per 100,000"
                },
                margin: {
                    l: 250,
                    t: 50
                }
            };
        
            Plotly.newPlot ("graph-one", data, layout);
        }
        
        function per100k(data, population) {
            return (data/population*100000)
        }
    });
});