// global variables
var californiaCenter = [36.78, -119.42];
var baseZoom = 6;
var queryUrl = "../static/data/CA_Counties.geojson";

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
    myMap.flyTo(californiaCenter, baseZoom);
    myMap.closePopup();
    d3.select(".header").text("Please select a County");
}

// updates map based on option chosen from drop down
function dropDownChanged(chosenCounty) {
    // if All is chosen, reset the map
    if(chosenCounty === "All") {
        recenterMap();
    }
    // otherwise, find the layer containing the county and center the map on that
    else {
        d3.select(".header").text(chosenCounty + " County");
        var layerKeys = Object.keys(myMap._layers);
        layerKeys.pop();
        layerKeys.forEach(key => {
            if(myMap._layers[key].feature) {
                if(myMap._layers[key].feature.properties.COUNTY_NAME === chosenCounty) {
                    myMap.flyToBounds(myMap._layers[key].getBounds());
                    myMap._layers[key].openPopup();
                }
            }
        });
    }
}

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

// Flask App
d3.json("http://127.0.0.1:5000/api/v1.0/demographics").then(function(data, err) {
    console.log(data);
})