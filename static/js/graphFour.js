/* for now we can just select a specific county, 
    for testing purposes change this variable and see if your graphs change */

var selectedCounty = "LOS ANGELES";

/*  read data, for now we can use the csv files
    make sure to put the path to the data you want to show 
    ../static/data/{filename} */
var file_path1 = "../static/data/CA_Police_Dept.csv";
var file_path2 = "../static/data/census_data.csv";

Promise.all([
    d3.csv(file_path1),
    d3.csv(file_path2),
]).then(function(data) {
    // filter the data based on the selectedCounty variable
    var filtered_data = data[0].filter(filterData);
    var census_data = data[1].filter(filterData);
    console.log(filtered_data);
    console.log(census_data);

    filtered_data.Agg_Assult = +filtered_data.Agg_Assult;
    filtered_data.Sex_Offences = +filtered_data.Sex_Offences;
    filtered_data.Manslaughter_Neg = +filtered_data.Manslaughter_Neg;
    filtered_data.Murder_and_Nonneg_Man = +filtered_data.Murder_and_Nonneg_Man;
    filtered_data.Rape = +filtered_data.Rape;
    filtered_data.Robbery = +filtered_data.Robbery;
    filtered_data.Simp_Assult = +filtered_data.Simp_Assult;
    filtered_data.Humman_Trafficking_Commercial_SA = +filtered_data.Humman_Trafficking_Commercial_SA;
    filtered_data.Humman_Trafficking_Invol_Ser = +filtered_data.Humman_Trafficking_Invol_Ser;

    census_data.Population = +census_data.Population
    population = census_data[0].Population
    console.log(population);

    // Variables to store total crime numbers
    let aggAssult = 0;
    let sexOffences = 0;
    let manslaughterNeg = 0;
    let murderAndNonnegMan = 0;
    let rape = 0;
    let robbery = 0;
    let simpAssult = 0;
    let humanTraffickingComm = 0;
    let humanTraffickingInvol = 0;
    let offencesTotal = 0;

    filtered_data.forEach(city => {
        // Cast each crime value to a number
        city.Agg_Assult = +city.Agg_Assult;
        city.Sex_Offences = +city.Sex_Offences;
        city.Manslaughter_Neg = +city.Manslaughter_Neg;
        city.Murder_and_Nonneg_Man = +city.Murder_and_Nonneg_Man;
        city.Rape = +city.Rape;
        city.Robbery = +city.Robbery;
        city.Simp_Assult = +city.Simp_Assult;
        city.Humman_Trafficking_Commercial_SA = +city.Humman_Trafficking_Commercial_SA;
        city.Humman_Trafficking_Invol_Ser = +city.Humman_Trafficking_Invol_Ser;
        city.Offences_Total = +city.Offences_Total;

        // Add each crime number to total
        aggAssult += city.Agg_Assult;
        sexOffences += city.Sex_Offences;
        manslaughterNeg += city.Manslaughter_Neg;
        murderAndNonnegMan += city.Murder_and_Nonneg_Man;
        rape += city.Rape;
        robbery += city.Robbery;
        simpAssult += city.Simp_Assult;
        humanTraffickingComm += city.Humman_Trafficking_Commercial_SA;
        humanTraffickingInvol += city.Humman_Trafficking_Invol_Ser;
        offencesTotal += city.Offences_Total;
    });

    crimes = {
    "Human Trafficking/Involuntary Servitude": humanTraffickingInvol,
    "Human Trafficking/Commercial Sex Acts": humanTraffickingComm,
    "Simple Assault": simpAssult,
    "Robbery": robbery,
    "Rape": rape,
    "Murder/ Non-negligent Manslaughter": murderAndNonnegMan,
    "Negligent Manslaughter": manslaughterNeg,
    "Sex Offences": sexOffences,
    "Aggravated Assault": aggAssult
    };

    crimesPer100k = {
        "Human Trafficking/Involuntary Servitude": per100k(humanTraffickingInvol),
        "Human Trafficking/Commercial Sex Acts": per100k(humanTraffickingComm),
        "Simple Assault": per100k(simpAssult),
        "Robbery": per100k(robbery),
        "Rape": per100k(rape),
        "Murder/ Non-negligent Manslaughter": per100k(murderAndNonnegMan),
        "Negligent Manslaughter": per100k(manslaughterNeg),
        "Sex Offences": per100k(sexOffences),
        "Aggravated Assault": per100k(aggAssult)
        };

    crimePercentage = [];

    Object.values(crimes).forEach(c => {
        let percentage = (c/offencesTotal*100).toFixed(2);
        let percentageString = `${percentage}%`
        crimePercentage.push(percentageString) 
    });

    // call functions to make graphs with filtered data
    // makeGraphOne(filtered_data);
    // makeGraphTwo(filtered_data);
    // makeGraphThree(filtered_data);
    makeGraphFour();

});

function filterData(data) {
    data.County = data.County.toUpperCase()
    return data.County == selectedCounty;
}

function per100k(data) {
    return (data/population*100000)
}


// function makeGraphOne(data) {
//     // use plotly to make desired graphs from the filtered data here




//     /* should end with something like this
//         uncomment below when trace and layout are completed */
//     // Plotly.newPlot("graph-one", trace, layout);
// };

function makeGraphFour() {
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
            color: ["#708090", "#8B4513", "#0000CD", "#3CB371", "#9932CC", "#FFD700", "#FF4500", "#FF1493", "#DC143C"]
        }
    }];

    var layout = {
        height: 450,
        width: 1200,
        title: "Crime Comparison",
        xaxis: {
            title: "Crime per 100,000"
        },
        margin: {
            t: 50,
            b: 50,
            l: 250,
            r: 50
        }
    };

    Plotly.newPlot ("graph-four", data, layout);
};