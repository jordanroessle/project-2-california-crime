/* for now we can just select a specific county, 
    for testing purposes change this variable and see if your graphs change */

var selectedCounty = "ALAMEDA";
var population;
var incomePerCapita;
var pctPoverty;
var pctEmployed;
var pctUnemployed;
var pctArmedForces;
var pctAfricanAmerican;
var pctAmericanIndian;
var pctAsian;
var pctHispanic;
var pctPacificIslander;
var pctWhite;
var pctOther;
var pctMultiple;


/*  read data, for now we can use the csv files
    make sure to put the path to the data you want to show 
    ../static/data/{filename} */
var file_path2 = "../static/data/census_data.csv";

d3.csv(file_path2).then(function(data) {
    // filter the data based on the selectedCounty variable
    var census_data = data.filter(filterData);

    census_data.forEach(county => {
    county.Population = +county.Population;
    county.Income_per_capita = +county.Income_per_capita;
    county.pct_Poverty = +county.pct_Poverty;
    county.pct_Employed = +county.pct_Employed;
    county.pct_Unemployed = +county.pct_Unemployed;
    county.pct_Armed_forces_active = +county.pct_Armed_forces_active;
    county.pct_African_american = +county.pct_African_american;
    county.pct_American_indian_alaskan_native = +county.pct_American_indian_alaskan_native;
    county.pct_Asian = +county.pct_Asian;
    county.pct_Hispanic_latino = +county.pct_Hispanic_latino;
    county.pct_Pacific_islander = +county.pct_Pacific_islander;
    county.pct_White = +county.pct_White;
    county.pct_Other_race = +county.pct_Other_race;
    county.pct_Multiple_races = +county.pct_Multiple_races;
    
    population = county.Population;
    incomePerCapita = county.Income_per_capita;
    pctPoverty = county.pct_Poverty;
    pctEmployed = county.pct_Employed;
    pctUnemployed = county.pct_Unemployed;
    pctArmedForces = county.pct_Armed_forces_active;
    pctAfricanAmerican = county.pct_African_american;
    pctAmericanIndian = county.pct_American_indian_alaskan_native;
    pctAsian = county.pct_Asian;
    pctHispanic = county.pct_Hispanic_latino;
    pctPacificIslander = county.pct_Pacific_islander;
    pctWhite = county.pct_White;
    pctOther = county.pct_Other_race;
    pctMultiple = county.pct_Multiple_races;

    });


    demoGraphOne();
    demoGraphTwo();



});
function filterData(data) {
    data.County = data.County.toUpperCase()
    return data.County == selectedCounty;
};

function demoGraphOne() {
Highcharts.chart('graph-one', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Employment<br> Breakdown',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: 50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '110%'
        }
    },
    series: [{
        type: 'pie',
        name: 'Population',
        innerSize: '50%',
        data: [
            ['Employed', pctEmployed],
            ['Other', 100-pctEmployed-pctUnemployed-pctArmedForces],
            ['Unemployed', pctUnemployed],
            ['Active Duty', pctArmedForces],
        ]
    }]
});
};

function demoGraphTwo() {
    var raceData = [
        ['African American', pctAfricanAmerican],
        ['American Indian/Alaskan Native', pctAmericanIndian],
        ['Asian', pctAsian],
        ['Hispanic/<br>Latino', pctHispanic],
        ['Pacific Islander', pctPacificIslander],
        ['White', pctWhite],
        ['Other', pctOther],
        ['Multiple', pctMultiple]
    ];
    var sortedRaceData = raceData.sort((a, b) => b[1] - a[1]);



    Highcharts.chart('highcharts-figure-one', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Race/Ethnicity<br> Breakdown',
            align: 'center',
            verticalAlign: 'middle',
            y: 60
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: 100,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Population',
            innerSize: '50%',
            data: sortedRaceData
        }]
    });
    };