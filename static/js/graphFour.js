/* for now we can just select a specific county, 
    for testing purposes change this variable and see if your graphs change */

var selectedCounty = "VENTURA";

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

    graphFourTable(data);

    census_data.Population = +census_data.Population
    population = census_data[0].Population
   
    // Variables to store total crime numbers
    let aggAssult = 0;
    let sexOffences = 0;
    let manslaughterNeg = 0;
    let murderAndNonnegMan = 0;
    let rape = 0;
    let robbery = 0;
    let simpAssult = 0;
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
        city.Offences_Total = +city.Offences_Total;

        // Add each crime number to total
        aggAssult += city.Agg_Assult;
        sexOffences += city.Sex_Offences;
        manslaughterNeg += city.Manslaughter_Neg;
        murderAndNonnegMan += city.Murder_and_Nonneg_Man;
        rape += city.Rape;
        robbery += city.Robbery;
        simpAssult += city.Simp_Assult;
        offencesTotal += city.Offences_Total;
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
        "Simple Assault": per100k(simpAssult),
        "Robbery": per100k(robbery),
        "Rape": per100k(rape),
        "Murder/ Non-negligent Manslaughter": per100k(murderAndNonnegMan),
        "Negligent Manslaughter": per100k(manslaughterNeg),
        "Sex Offences": per100k(sexOffences),
        "Aggravated Assault": per100k(aggAssult)
    };

    crimesSeries = [
        {name: "Simple Assault",
        data: [per100k(simpAssult)]}, 
        {name: "Robbery",
        data: [per100k(robbery)]}, 
        {name: "Rape",
        data: [per100k(rape)]}, 
        {name: "Murder/ Non-negligent Manslaughter",
        data: [per100k(murderAndNonnegMan)]}, 
        {name: "Negligent Manslaughter",
        data: [per100k(manslaughterNeg)]},
        {name: "Sex Offences",
        data: [per100k(sexOffences)]},
        {name: "Aggravated Assault",
        data: [per100k(aggAssult)]}
    ];



    crimePercentage = [];

    Object.values(crimes).forEach(c => {
        let percentage = (c/offencesTotal*100).toFixed(2);
        let percentageString = `${percentage}%`
        crimePercentage.push(percentageString) 
    });

    makeGraphFour();

});

function graphFourTable(data) {
    counties = []
    data[0].forEach(d => {
        if (!(counties.includes(d.County))) {
            counties.push(d.County)
        }
    });

 
    rowCounter = 0
    countiesList = []
    for (i=0; i < counties.length; i++) {
        if (i%8 == 0) {
            rowCounter +=1
            countiesList.push([])
        }
        countiesList[rowCounter-1].push(counties[i])
    }

    var tr = d3.select("tbody")
    .selectAll("tr")
    .data(countiesList)
    .enter().append("tr");

    var td = tr.selectAll("td")
    .data(function(d,i) {return Object.values(d);})
    .enter().append("td")
    .html(function(d) {return `<input class="form-check-input" type="checkbox" id="inlineCheckbox1" value=${d}>
    <label class="form-check-label" for="inlineCheckbox1">${d}</label>`
    });
};

function filterData(data) {
    data.County = data.County.toUpperCase()
    return data.County == selectedCounty;
};

function per100k(data) {
    return data/population*100000;
};

function makeGraphFour(data) {
    Highcharts.chart('fourChart', {
        chart: {
            type: 'bar'
        },
        title:{
            text: "Crime per city"
        },
        subtitle: {
            text: "Test"
        },
        xAxis: {
            categories: [selectedCounty],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: "Crimes (per 100,000)",
                align: "high"
            },
            labels: {
                overflow:"justify"
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'top',
         x: -40,
         y: 80,
         floating: true,
         borderWidth: 1,
         backgroundColor:
             Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
         shadow: true
         },
         credits: {
             enabled: false
         },
         series: crimesSeries
    });
};