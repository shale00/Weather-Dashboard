//Element References
var searchBtn = $("searchBtn");
var searchInput = $("#searchInput");
var cityHistory = $("#cityHistory");
var forecastContainer = $("#forecastContainer");

//Variable array for search history list
var searchHistory = [];

//Timezone plugin for day.js
dayjs.extend(window.dayjs_plugin_timezone);


// Init search history
function init() {
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderHistory();
}

//Search History Function
function renderHistory() {
  //Clear history list
  $("#cityHistory").empty();

  //Show most recent history at top of list
  searchHistory
    .slice()
    .reverse()
    .forEach(function (response) {
      var button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute("aria-controls", "today forecast");
      button.classList.add(
        "history-btn",
        "btn-history",
        "list-group-item",
        "list-group-item-action"
      );
      button.setAttribute("searchInput", response);
      button.textContent = response;
      cityHistory.append(button);
    });
}

function appendToHistory(response) {
  // If no history, return
  if (searchHistory.indexOf(response) !== -1) {
    return;
  }
  searchHistory.push(response);

  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  renderHistory();
}

$("body").on("click", "btn-history", function () {

});


$("#searchBtn").click(function (event) {
  event.preventDefault();
  let city = $("#searchInput").val();
  var APIKey = "0dca0bd477f22fabee6b70094d95fe34";
  var geoQueryURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    APIKey;

  fetch(geoQueryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      var forecastQueryUrl =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=" +
        APIKey;
      var currentDayQuery =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=" +
        APIKey;

      if (!searchInput.val()) {
        console.log("No Search Input!");
        return;
      }

      fetch(currentDayQuery)
        .then(function (response) {
          //Clear Current Weather container
          $("#currentWeather").empty();
          return response.json();
        })
        .then(function (data) {
          //add to history
          appendToHistory(data.name);

          let unixTimestamp = data.dt;
          let date = dayjs.unix(unixTimestamp);
          let formatDate = date.format("MM-DD-YYYY");
          let cityName = data.name;
          let weatherIcon = data.weather[0].icon;
          let temperature = data.main.temp;
          let wind = data.wind.speed;
          let humidity = data.main.humidity;

          //create current city weather info
          let currentWeatherDiv = $("<div>")
            .attr("id", "currentWeather")
            .addClass("card flex-md-row mb-4 box-shadow h-md-250")
            .appendTo($("#weatherData"));
          let cardBodyDiv = $("<div>")
            .addClass("card-body d-flex flex-column align-items-start")
            .appendTo($("#currentWeather"));
          let cityH3 = $("<h3>")
            .attr("id", "ctyName")
            .addClass("mb-0 pb-3")
            .appendTo(cardBodyDiv);
          let cityNameSpan = $("<span>")
            .addClass("city-name")
            .text(cityName + " ")
            .appendTo(cityH3);
          let weatherDateSpan = $("<span>")
            .addClass("weather-date")
            .text("(" + formatDate + ")")
            .appendTo(cityH3);
          let weatherIconImg = $("<img>")
            .addClass("weather-icon")
            .attr(
              "src",
              "http://openweathermap.org/img/wn/" + weatherIcon + ".png"
            )
            .appendTo(cityH3);
          let temperatureP = $("<p>")
            .text("Temperature: " + temperature + "°F")
            .appendTo(cardBodyDiv);
          let windP = $("<p>")
            .text("Wind Speed: " + wind + " mph")
            .appendTo(cardBodyDiv);
          let humidityP = $("<p>")
            .text("Humidity: " + humidity + "%")
            .appendTo(cardBodyDiv);
        });

      fetch(forecastQueryUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var city = data.city.name;
          var weather = data.list[0];
          var date = dayjs().format("M/D/YYYY");
          var tempF = weather.main.temp;
          var windMph = weather.wind.speed;
          var humidity = weather.main.humidity;
          var iconUrl =
            "https://openweathermap.org/img/w/" +
            weather.weather[0].icon +
            ".png";
          var iconDescription =
            weather.weather[0].description || weather[0].main;

          var card = $("<div>").addClass("card");
          var cardBody = $("<div>").addClass("card-body");
          var heading = $("<h2>")
            .addClass("h3 card-title")
            .text(city + " (" + date + ")");
          var weatherIcon = $("<img>")
            .addClass("weather-img")
            .attr("src", iconUrl)
            .attr("alt", iconDescription);
          var tempEl = $("<p>")
            .addClass("card-text")
            .text("Temp: " + tempF + "°F");
          var windEl = $("<p>")
            .addClass("card-text")
            .text("Wind: " + windMph + " MPH");
          var humidityEl = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + humidity + " %");

          cardBody.append;

          // Unix timestamps
          var startDate = dayjs().add(1, "day").startOf("day").unix();
          var endDate = dayjs().add(6, "day").startOf("day").unix();

          var headingCol = $("<div>").addClass("col-12");
          var heading = $("<h4>").text("5-Day Forecast:");
          headingCol.append(heading);

          forecastContainer.empty();
          forecastContainer.append(headingCol);

          data.list.forEach(function (item) {
            // Only retrieves data 5 days after today's date
            if (item.dt >= startDate && item.dt < endDate) {
              // Returns data for 12 o'clock (noon)
              if (item.dt_txt.slice(11, 13) === "12") {
                // var cardDeck = $("<div>").addClass(
                //   "card-deck mb-5 text-center"
                // );
                // var container = $("<div>").addClass("container");
                // var row = $("<div>").addClass("row");
                var colMd2 = $("<div>").addClass("col-md-2");
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                var date = $("<p>")
                  .addClass("card-text")
                  .text(dayjs(item.dt_txt).format("M/D/YYYY"));
                var iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
                var iconDescription =
                  item.weather[0].description || item.weather[0].main;
                var weatherIcon = $("<img>").attr({
                  src: iconUrl,
                  alt: iconDescription,
                  class: "weather-img",
                });
                var temp = $("<p>")
                  .addClass("card-text")
                  .text(`Temp: ${item.main.temp}°F`);
                var wind = $("<p>")
                  .addClass("card-text")
                  .text(`Wind: ${item.wind.speed} MPH`);
                var humidity = $("<p>")
                  .addClass("card-text")
                  .text(`Humidity: ${item.main.humidity} %`);

                cardBody.append(date, weatherIcon, temp, wind, humidity);
                card.append(cardBody);
                colMd2.append(card);
                // row.append(colMd2);
                // container.append(row);
                // cardDeck.append(container);
                forecastContainer.append(colMd2);
              }
            }
          });
        });
    });
});

init();