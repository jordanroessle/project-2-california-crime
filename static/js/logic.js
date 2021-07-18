var queryUrl = "../static/data/CA_Counties.geojson"

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

function createFeatures(countyData) {
    function onEachFeature(feature, layer) {
        // layer.on({
        //     click: function(event) {
        //     myMap.fitBounds(event.target.getBounds());
        //     }
        // })
        
        layer.bindPopup("<h3>" + feature.properties.COUNTY_NAME + "</h3>")
    }

    var countyLines = L.geoJSON(countyData, {
        onEachFeature: onEachFeature
    });
    createMap(countyLines);
}

function createMap(countyLines) {

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

    // define overlay maps
    var overlayMaps = {
        "County Lines": countyLines
    };

    var californiaCenter = [36.78, -119.42];
    // create map, center on US
    var myMap = L.map("map", {
        center: californiaCenter,
        zoom: 6, 
        layers: [outdoormap, countyLines]
    });

    // Create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

function dropDownOptions() {
    file_path = "../static/data/CA_County_Crime.csv"
    
    d3.csv(file_path).then(function (data) {
        data.forEach(function(county) {
            d3.select("#Counties").append("option").text(`${county.County}`)
        });
    });
}

dropDownOptions()