var searchBtn = $('searchBtn');
var searchInput = $('#searchInput');
var cityHistory = $('cityHistory');
var searchHistory = [];



function getNextDayWeatherIcons(forecastData) {
    let wIcons = [];
    let date = new Date();
  
    for (let i = 0; i < 5; i++) {
      date.setDate(date.getDate() + 1);
      const dateString = date.toISOString().slice(0, 10);
      const noonObject = forecastData.list.find(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getHours() === 18 && itemDate.toISOString().slice(0, 10) === dateString;
      });
      if (noonObject) {
        const weatherIcon = noonObject.weather.icon;
        wIcons.push(weatherIcon);
      } else {
        wIcons.push(null);
      }
    }
    console.log(forecastData.list[0].weather[0].icon);
    console.log(forecastData.list[0].weather[0]);
    console.log(forecastData.list[0]);


    return wIcons;
  }

$('#searchBtn').click( function(event) {
    event.preventDefault();
    let city = $('#searchInput').val();
    var APIKey = "0dca0bd477f22fabee6b70094d95fe34"
    let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial";
    console.log('click');
    if (!searchInput.val()) {
        return;
    } 

    fetch(currentWeatherURL).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let unixTimestamp = data.dt;
        let date = dayjs.unix(unixTimestamp);
        let formatDate = date.format('MM-DD-YYYY');
        let cityName = data.name;
        let weatherIcon = data.weather[0].icon;
        let temperature = data.main.temp;
        let wind = data.wind.speed;
        let humidity = data.main.humidity;


        //create current city weather info
        let currentWeatherDiv = $("<div>").attr("id", "currentWeather").addClass("card flex-md-row mb-4 box-shadow h-md-250").appendTo($("#weatherData"));
        let cardBodyDiv = $("<div>").addClass("card-body d-flex flex-column align-items-start").appendTo($("#currentWeather"));
        let cityH3 = $("<h3>").attr("id", "ctyName").addClass("mb-0 pb-3").appendTo(cardBodyDiv);
        let cityNameSpan = $("<span>").addClass("city-name").text(cityName + " ").appendTo(cityH3);
        let weatherDateSpan = $("<span>").addClass("weather-date").text("(" + formatDate + ")").appendTo(cityH3);
        let weatherIconImg = $("<img>").addClass("weather-icon").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png").appendTo(cityH3);
        let temperatureP = $("<p>").text("Temperature: " + temperature + "°F").appendTo(cardBodyDiv);
        let windP = $("<p>").text("Wind Speed: " + wind + " mph").appendTo(cardBodyDiv);
        let humidityP = $("<p>").text("Humidity: " + humidity + "%").appendTo(cardBodyDiv);
        });

        fetch(forecastQueryUrl).then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            const weatherIcons = getNextDayWeatherIcons(data);
            console.log(weatherIcons);

            const buckets = {
                dayOne: { temps: [], windSpeeds: [], humidities: [] },
                dayTwo: { temps: [], windSpeeds: [], humidities: [] },
                dayThree: { temps: [], windSpeeds: [], humidities: [] },
                dayFour: { temps: [], windSpeeds: [], humidities: [] },
                dayFive: { temps: [], windSpeeds: [], humidities: [] },
              };
              
              data.list.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const currentDate = new Date();
                const diffDays = Math.round((date - currentDate) / (1000 * 60 * 60 * 24));
              
                if (diffDays >= 1 && diffDays <= 5) {
                  const dateString = date.toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});
                  
              
                  if (diffDays === 1) {
                    buckets.dayOne.temps.push(item.main.temp);
                    buckets.dayOne.windSpeeds.push(item.wind.speed);
                    buckets.dayOne.humidities.push(item.main.humidity);
                  } else if (diffDays === 2) {
                    buckets.dayTwo.temps.push(item.main.temp);
                    buckets.dayTwo.windSpeeds.push(item.wind.speed);
                    buckets.dayTwo.humidities.push(item.main.humidity);
                  } else if (diffDays === 3) {
                    buckets.dayThree.temps.push(item.main.temp);
                    buckets.dayThree.windSpeeds.push(item.wind.speed);
                    buckets.dayThree.humidities.push(item.main.humidity);
                  } else if (diffDays === 4) {
                    buckets.dayFour.temps.push(item.main.temp);
                    buckets.dayFour.windSpeeds.push(item.wind.speed);
                    buckets.dayFour.humidities.push(item.main.humidity);
                  } else if (diffDays === 5) {
                    buckets.dayFive.temps.push(item.main.temp);
                    buckets.dayFive.windSpeeds.push(item.wind.speed);
                    buckets.dayFive.humidities.push(item.main.humidity);
                  }



                };            
              });
              

              const averages = {};
                Object.entries(buckets).forEach(([day, values]) => {
                    const avgTemp = values.temps.reduce((acc, curr) => acc + curr) / values.temps.length;
                    const avgWind = values.windSpeeds.reduce((acc, curr) => acc + curr) / values.windSpeeds.length;
                    const avgHumidity = values.humidities.reduce((acc, curr) => acc + curr) / values.humidities.length;
                    averages[day] = { avgTemp, avgWind, avgHumidity, noonObject: values.noonObject };
                })


                // Get a reference to the forecast container element
                const forecastContainer = $('#forecastContainer');

                // Loop through each day in the averages object and create a card for it
                Object.entries(averages).forEach(([day, values], index) => {

                const date = new Date();
                date.setDate(date.getDate() + index + 1);
                const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

                const noonObject = data.list.find(item => {
                    const itemDate = new Date(item.dt * 1000);
                    return itemDate.getHours() === 12 && itemDate.toDateString() === date.toDateString();
                });
             
                console.log(noonObject.weather);
                // const weatherIcon = noonObject.weather[0].icon;

                //add 5day divs

                //NEED TO MAKE SURE ONLY ONE COL-MD-2
                const card = document.createElement('div');
                card.classList.add('col-md-2');
                card.innerHTML = `
                    <div class="card">
                    <div class="card-body">
                        <p class="card-text">${dateString}</p>
                        
                        <p class="card-text">${values.avgTemp.toFixed(1)} °F</p>
                        <p class="card-text">${values.avgWind.toFixed(1)} mph</p>
                        <p class="card-text">${values.avgHumidity.toFixed(0)}%</p>
                    </div>
                    </div>`;
                // Append the card to the forecast container
                  forecastContainer.append(card);
                });


            });
         })

        //  <img class="weather-icon" src="http://openweathermap.org/img/wn/${weatherIcon}.png">


        
          