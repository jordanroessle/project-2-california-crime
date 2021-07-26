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
    
        crimePercentage = [];
    
        Object.values(crimes).forEach(c => {
            let percentage = (c/offencesTotal*100).toFixed(2);
            let percentageString = `${percentage}%`
            crimePercentage.push(percentageString) 
        });
    
        makeGraphThree();
    
    });
    
      
    function filterData(data) {
        data.County = data.County.toUpperCase()
        return data.County == selectedCounty;
    }
    
    function per100k(data) {
        return (data/population*100000)
    }
    
    function makeGraphThree() {
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
            height: 450,
            width: 1200,
            title: `Crime breakdown for ${selectedCounty}`,
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
    
        Plotly.newPlot ("graph-three", data, layout);
    };