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

d3.json(queryUrl).then(function(data) {
    // give dropdown options
    dropDownOptions(data.features);
    // give countyLines features
    createFeatures(data.features, myMap).addTo(countyLines);
});

// Create layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


function createFeatures(countyData, myMap) {
    function onEachFeature(feature, layer) {
        layer.on({
            click: function(event) {
                myMap.fitBounds(event.target.getBounds());
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

function dropDownOptions(data) {
        d3.select("#Counties")
            .selectAll("inserted-option")
            .data(data)
            .enter()
            .append("option")
            .text(d => d.properties.COUNTY_NAME);       
}

function recenterMap() {
    myMap.flyTo(californiaCenter, baseZoom);
    myMap.closePopup();
    d3.select(".header").text("Please select a County");
}

function dropDownChanged(chosenCounty) {
    if(chosenCounty === "All") {
        recenterMap();
    }
    else {
        d3.select(".header").text(chosenCounty + " County");
        var layerKeys = Object.keys(myMap._layers);
        layerKeys.pop();
        layerKeys.forEach(key => {
            if(myMap._layers[key].feature) {
                if(myMap._layers[key].feature.properties.COUNTY_NAME === chosenCounty) {
                    myMap.fitBounds(myMap._layers[key].getBounds());
                    myMap._layers[key].openPopup();
                }
            }
        });
    }
}

function updateDropDown(chosenCounty) {
    var options = d3.select("#Counties").selectAll("option").nodes();
    // pop "All" selection
    options.shift();
    options.forEach(option => {
        if(option.__data__.properties.COUNTY_NAME === chosenCounty) {
            option.selected = true;
        }
    })
}