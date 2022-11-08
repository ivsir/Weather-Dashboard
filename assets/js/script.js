var currentForecastEl = document.querySelector("#current-forecast-card");
var weatherForecastEl = document.querySelector("#five-day");
var searchHistoryEl = document.querySelector("#search-history");

var latitude;
var longitude;
var apiKey = "e39d6eb5facbd4f8244a672d51ea14b0";

var savedCities = [];

var searchHistory = function () {
  var recentCities = JSON.parse(localStorage.getItem("recent-city"));
  

  if (recentCities) {
    savedCities = recentCities;
  }
  searchHistoryEl.textContent = "";
  for (var i = 0; i < savedCities.length; i++) {
    searchHistoryEl.innerHTML += `<li><button class="recentCity">${savedCities[i]}</button></li>`;
  }
  var recentCityEl = document.querySelectorAll(".recentCity");

  for (var i = 0; i < recentCityEl.length; i++) {
    recentCityEl[i].addEventListener("click", function () {
      getCityLatLon(this.textContent);
    });
  }
};

searchHistory();

var getCityLatLon = function (city) {
  var url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=imperial&appid=${apiKey}`;
  if (savedCities.includes(city) === false) {
    savedCities.push(city);
    localStorage.setItem("recent-city", JSON.stringify(savedCities));
    searchHistory();
  }
  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWeather(data, city);
        longitude = data[0].lon;
        latitude = data[0].lat;
        getCurrentWeather(latitude, longitude);
        getWeatherForecast(latitude, longitude);
      });
    } else {
      alert("Error:" + response.statusText);
    }
  });
};

var getCurrentWeather = function (latitude, longitude) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  fetch(weatherUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var currentCity = data.name;
        var currentDay = moment().format("  (MM/DD/YYYY)");
        var currentIconCode = data.weather[0].icon;
        var iconUrl =
          "https://openweathermap.org/img/w/" + currentIconCode + ".png";

        var currentTemp = data.main.temp;

        var currentWind = data.wind.speed;

        var currentHumidity = data.main.humidity;

        currentForecastEl.innerHTML = `
        <div class="card mt-2 card-main-div" >             
        <div class="card-body">
        <div class="d-flex flex-row">
        <h2
        class="card-title align-self-center"
        id="main-city-name"
        >
        ${currentCity} ${currentDay} <img id="main-weather-icon" src="${iconUrl}" alt="Weather icon">
        </h2>
        </div>
        <h6 
        class="card-subtitle text-muted" 
        id="main-city-temp"
        >
        Temperature: ${currentTemp}\u00B0F
        </h6>
        <h6
        class="card-subtitle mt-3 text-muted"
        id="main-city-wind"
        >
        Wind Speed: ${currentWind} MPH
        </h6>
        <h6
        class="card-subtitle mt-3 text-muted"
        id="main-city-humid"
        >
        Humidity: ${currentHumidity}%
        </h6>
        </div>
        </div>
        `;
        // localStorage.setItem("current-forecast", currentForecastEl.innerHTML);
      });
    } else {
      alert("Error:" + response.statusText);
    }
  });
};


var getWeatherForecast = function (latitude, longitude) {
  const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  fetch(weatherUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        weatherForecastEl.textContent = "";
        // temperature for next five days
        for (i = 6; i < data.list.length; i += 8) {
          var date = moment(data.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format(
            "MM-DD-YYYY"
          );
          var currentIconCode = data.list[i].weather[0].icon;
          var iconUrl =
            "https://openweathermap.org/img/w/" + currentIconCode + ".png";
          var currentTemp = data.list[i].main.temp;
          var currentWindSpeed = data.list[i].wind.speed;
          var currentHumidity = data.list[i].main.humidity;

          weatherForecastEl.innerHTML += `<div class="col-10 col-md-2 col-lg-2 card bg-secondary">
            <h3>${date}</h3>
            <h5>
            <img src = "${iconUrl}">
            </h5>
            <h6>
            Temperature: ${currentTemp}\u00B0F
            </h6>
            <h6>
            Wind Speed: ${currentWindSpeed} MPH
            </h6>
            <h6>
            Humidity: ${currentHumidity}%
            </h6>
            </div>`;
          // localStorage.setItem("weather-forecast", weatherForecastEl.innerHTML);
        }
      });
    }
  });
};

var searchFormEl = document.querySelector("#search-form");
var cityNameInputEl = document.querySelector("#cityName");

var formSubmitHandler = function (event) {
  event.preventDefault();
  var city = cityNameInputEl.value.trim();

  if (city) {
    getCityLatLon(city);
  } else {
    alert("Please enter a city");
  }
  getCityLatLon(city);
};

// this will display the weather
var displayWeather = function () {
};

searchFormEl.addEventListener("submit", formSubmitHandler);
