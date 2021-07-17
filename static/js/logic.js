var query_url = 'https://services6.arcgis.com/snwvZ3EmaoXJiugR/arcgis/rest/services/BOE_citycounty/FeatureServer/0/query?where=1%3D1&outFields=COUNTY&outSR=4326&f=json';

d3.json(query_url).then(function(data) {
    console.log(data);
});