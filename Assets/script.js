var searchBtn = $('searchBtn');
var searchInput = $('#searchInput');
var cityHistory = $('cityHistory');


// var printHistory = function (name) {
//     var listEl = $('li');
//     var listDetail = name;
//     //do we need the above var?
//     //ON 05-24..

// }

// var handleSearchSubmit = function (event) {
//     event.preventDefault();

// }

$('#searchBtn').click( function() {
    console.log('search');
    let city = $('#searchInput').val();
    var APIKey = "0dca0bd477f22fabee6b70094d95fe34"
    var geoQueryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;

    fetch(geoQueryURL).then(function(response){
        return response.json();
    })
    .then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey
        var currentDayQuery = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey

        fetch(forecastQueryUrl).then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
        fetch(currentDayQuery).then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            let unixTimestamp = data.dt;
            let date = dayjs.unix(unixTimestamp);
            let formatDate = date.format('YYYY-MM-DD');
            console.log(formatDate);
            let cityName = data.name;
            //create current city weather info
            let currentWeatherInfo = $(`<div class="card flex-md-row mb-4 box-shadow h-md-250"></div>`);
            $('#ctyName').text(cityName);
            console.log(cityName);
            
        })
    })
})