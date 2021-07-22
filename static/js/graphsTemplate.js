/* for now we can just select a specific county, 
    for testing purposes change this variable and see if your graphs change */

var selectedCounty = "ALAMEDA";

/*  read data, for now we can use the csv files
    make sure to put the path to the data you want to show 
    ../static/data/{filename} */
var file_path = "";

d3.read_csv(file_path).then(function(data) {
    // filter the data based on the selectedCounty variable
    var filtered_data = "";

    // call functions to make graphs with filtered data
    makeGraphOne(filtered_data);

});

function makeGraphOne(data) {
    // use plotly to make desired graphs from the filtered data here




    /* should end with something like this
        uncomment below when trace and layout are completed */
    // Plotly.newPlot("graph-one", trace, layout);
}