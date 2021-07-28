/* for now we can just select a specific county, 
for testing purposes change this variable and see if your graphs change */

var selectedCounty = [];
var filterByCounties;


/*  read data, for now we can use the csv files
    make sure to put the path to the data you want to show 
    ../static/data/{filename} */
var route1 = "http://127.0.0.1:5000/api/v1.0/crimes";
var route2 = "http://127.0.0.1:5000/api/v1.0/demographics";



Promise.all([
    d3.json(route1),
    d3.json(route2),
]).then(function(data) {
    console.log(data);
    // initialize dropdowns
    dropDownOptions(data[1]); 
    filterByCounties = function filterByCounties(selectedCounty) {
        // filter the data based on the selectedCounty variable
        var filterData = [];
        var population = []; 
        selectedCounty.forEach(county => {
            filterData.push(data[0].filter(dept => dept.County.toUpperCase() === county.toUpperCase()));
            population.push( data[1].filter(dept => dept.County === county)[0].Population)
        })

        
        // Variables to store total crime numbers
        var aggAssult = [];
        var sexOffences = [];
        var manslaughterNeg = [];
        var murderAndNonnegMan = [];
        var rape = [];
        var robbery = [];
        var simpAssult = [];
        var offencesTotal = [];

        filterData.forEach(city => {
            aggAssult.push(0);
            sexOffences.push(0);
            manslaughterNeg.push(0);
            murderAndNonnegMan.push(0);
            rape.push(0);
            robbery.push(0);
            simpAssult.push(0);
            offencesTotal.push(0)
        });

        filterData.forEach((county, i) => {
            county.forEach(city => {
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
                if(city.Agg_Assult) {
                    aggAssult[i] += city.Agg_Assult;
                }
                if(city.Agg_Assult) {
                    sexOffences[i] += city.Sex_Offences;
                }
                if(city.Agg_Assult) {
                    manslaughterNeg[i] += city.Manslaughter_Neg;
                }
                if(city.Agg_Assult) {
                    murderAndNonnegMan[i] += city.Murder_and_Nonneg_Man;
                }
                if(city.Agg_Assult) {
                    rape[i] += city.Rape;
                }
                if(city.Agg_Assult) {
                    robbery[i] += city.Robbery;
                }
                if(city.Agg_Assult) {
                    simpAssult[i] += city.Simp_Assult;
                }
                if(city.Agg_Assult) {
                    offencesTotal[i] += city.Offences_Total;
                }
            });
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

        crimesSeries = [
            {name: "Simple Assault",
            data: crimesPer100k["Simple Assault"]}, 
            {name: "Robbery",
            data: crimesPer100k["Robbery"]}, 
            {name: "Rape",
            data: crimesPer100k["Rape"]}, 
            {name: "Murder/ Non-negligent Manslaughter",
            data: crimesPer100k["Murder/ Non-negligent Manslaughter"]}, 
            {name: "Negligent Manslaughter",
            data: crimesPer100k["Negligent Manslaughter"]},
            {name: "Sex Offences",
            data: crimesPer100k["Sex Offences"]},
            {name: "Aggravated Assault",
            data: crimesPer100k["Aggravated Assault"]}
        ];



        crimePercentage = [];

        Object.values(crimes).forEach(c => {
            let percentage = (c/offencesTotal*100).toFixed(2);
            let percentageString = `${percentage}%`
            crimePercentage.push(percentageString) 
        });
        makeGraphFour(crimesSeries, selectedCounty);
    }
    filterByCounties(selectedCounty);
});

function per100k(data, population) {
    returnMe = []
    data.forEach((county, i) => {
        returnMe.push(+(county/population[i] * 100000).toFixed(2));
    });
    return returnMe;
}

function makeGraphFour(data, selectedCounty) {
    // remove existing chart if exists
    d3.select("#fourChart").html("");
    Highcharts.chart('fourChart', {
        chart: {
            type: 'bar',
            height: "600px"
        },
        title:{
            text: "Crime per County", 
            align: "center"
        },
        xAxis: {
            categories: selectedCounty,
        },
        yAxis: {
            min: 0,
            title: {
                text: "Crimes (per 100,000)",
                align: "middle"
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
            y: 100,
            floating: false,
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

function dropDownChanged() {
    dropDowns = d3.selectAll("select");
    selectedCounty = [];
    dropDowns.nodes().forEach(node => {
        if(node.value !== "---"){
            selectedCounty.push(node.value);
        }
    })
    filterByCounties(selectedCounty);
}

function dropDownOptions(data) {
    // sort alphabetically
    data.sort(function(a,b) {
        if(a.County < b.County) {return -1;}
        if(a.County > b.County) {return 1;}
        return 0;
    })
    d3.select("#first-County")
        .selectAll("inserted-option")
        .data(data)
        .enter()
        .append("option")
        .text(d => d.County);

    d3.select("#second-County")
        .selectAll("inserted-option")
        .data(data)
        .enter()
        .append("option")
        .text(d => d.County);

    d3.select("#third-County")
        .selectAll("inserted-option")
        .data(data)
        .enter()
        .append("option")
        .text(d => d.County);

    d3.select("#fourth-County")
        .selectAll("inserted-option")
        .data(data)
        .enter()
        .append("option")
        .text(d => d.County);

    d3.select("#fifth-County")
        .selectAll("inserted-option")
        .data(data)
        .enter()
        .append("option")
        .text(d => d.County);
}