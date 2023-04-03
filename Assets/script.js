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
    let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey
    var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    fetch(currentWeatherURL).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        let unixTimestamp = data.dt;
        let date = dayjs.unix(unixTimestamp);
        let formatDate = date.format('MM-DD-YYYY');
        console.log(formatDate);
        let cityName = data.name;
        let weatherIcon = data.weather[0].icon;
        let temperature = data.main.temp;
        let wind = data.wind.speed;
        let humidity = data.main.humidity;

        //clear previous result
        $('#forecastData').html(``);

        //create current city weather info
        let currentWeatherDiv = $("<div>").attr("id", "currentWeather").addClass("card flex-md-row mb-4 box-shadow h-md-250").appendTo($("#forecastData"));
        let cardBodyDiv = $("<div>").addClass("card-body d-flex flex-column align-items-start").appendTo(currentWeatherDiv);
        let cityDateH3 = $("<h3>").attr("id", "ctyName").addClass("mb-0 pb-3").appendTo(cardBodyDiv);
        let cityNameSpan = $("<span>").addClass("city-name").text(cityName + " ").appendTo(cityDateH3);
        let weatherDateSpan = $("<span>").addClass("weather-date").text("(" + formatDate + ")").appendTo(cityDateH3);
        let weatherIconImg = $("<img>").addClass("weather-icon").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png").appendTo(cityDateH3);
        let temperatureP = $("<p>").addClass("temperature").text("Temperature: " + temperature + "°F").appendTo(cardBodyDiv);
        let windP = $("<p>").addClass("wind").text("Wind Speed: " + wind + " mph").appendTo(cardBodyDiv);
        let humidityP = $("<p>").addClass("humidity").text("Humidity: " + humidity + "%").appendTo(cardBodyDiv);
        })
      
        
})