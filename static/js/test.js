/* for now we can just select a specific county, 
for testing purposes change this variable and see if your graphs change */

var selectedCounty = "ALAMEDA";

/*  read data, for now we can use the csv files
    make sure to put the path to the data you want to show 
    ../static/data/{filename} */
var file_path = "../static/data/CA_Police_Dept.csv";
let filtered_data = []
let aggAssult = 0;
let sexOffences = 0;
let manslaughterNeg = 0;
let murderAndNonnegMan = 0;
let rape = 0;
let robbery = 0;
let simpAssult = 0;
let offencesTotal = 0;

d3.csv(file_path, function(data){
    if(data.County == selectedCounty){
        filtered_data.push(data)
    }
})

filtered_data.forEach(city => {
    city.Agg_Assult = +city.Agg_Assult;
    city.Sex_Offences = +city.Sex_Offences;
    city.Manslaughter_Neg = +city.Manslaughter_Neg;
    city.Murder_and_Nonneg_Man = +city.Murder_and_Nonneg_Man;
    city.Rape = +city.Rape;
    city.Robbery = +city.Robbery;
    city.Simp_Assult = +city.Simp_Assult;
    city.Offences_Total = +city.Offences_Total;

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

function makeGraphOne(data) {
    Highcharts.chart('container', {
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
            categories: ["Simple Assault", "Robbery", "Rape", "Murder/ Non-negligent Manslaughter", "Negligent Manslaughter", "Sex Offences", "Aggravated Assault"]
        },
        yAxis: {
            min: 0,
            title: {
                text: "Ammount of crimes",
                align: "high"
            },
            labels: {
                overflow:"justify"
            }
        },
        tooltip: {
            valueSuffix: "Tens"
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
         series: [{
            data: [10,10,10,10,10,10,10]
        }]
    })
}


    
   