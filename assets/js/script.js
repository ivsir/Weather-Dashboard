var currentForecastEl = document.querySelector("#current-forecast-card");
var mainCityNameEl = document.querySelector("#main-city-name");
var currentTempEl = document.querySelector("#main-city-temp");
var currentWindEl = document.querySelector("#main-city-wind");
var currentHumidityEl = document.querySelector("#main-city-humid");
var currentIconEl = document.querySelector("#main-weather-icon");
var weatherForecastEl = document.querySelector("#five-day");
var searchHistoryEl = document.querySelector("#search-history");

var latitude;
var longitude;
var apiKey = "e39d6eb5facbd4f8244a672d51ea14b0";

var savedCities = [];

var searchHistory = function (city) {
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
        console.log(data, "data");
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
        console.log(data, "data");

        var currentCity = data.name;
        var currentDay = moment().format("  (MM/DD/YYYY)");

        var currentIconCode = data.weather[0].icon;
        var iconUrl =
          "https://openweathermap.org/img/w/" + currentIconCode + ".png";

        mainCityNameEl.innerHTML = currentCity + " " + currentDay + " ";
        currentIconEl.setAttribute("src", iconUrl);
        mainCityNameEl.appendChild(currentIconEl);

        var currentTemp = data.main.temp;
        currentTempEl.innerHTML = "Temperature: " + currentTemp + "\u00B0F";

        var currentWind = data.wind.speed;
        currentWindEl.innerHTML = "Wind Speed: " + currentWind + " MPH";

        var currentHumidity = data.main.humidity;
        currentHumidityEl.innerHTML = "Humidity: " + currentHumidity + " %";

        currentForecastEl.innerHTML = `             
        <div class="card-body">
          <div class="d-flex flex-row">
            <h2
              class="card-title align-self-center"
              id="main-city-name"
            >
            San Diego <img id="main-weather-icon" src="${iconUrl}" alt="Weather icon">
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
      </div>`;
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
        console.log(data);
        weatherForecastEl.textContent = "";
        // temperature for next five days
        for (i = 6; i < data.list.length; i += 8) {
          var currentIconCode = data.list[i].weather[0].icon;
          var iconUrl =
            "https://openweathermap.org/img/w/" + currentIconCode + ".png";
          var currentTemp = data.list[i].main.temp;
          var currentWindSpeed = data.list[i].wind.speed;
          var currentHumidity = data.list[i].main.humidity;

          weatherForecastEl.innerHTML += `<div class="col-10 col-md-2 col-lg-2">
          <h3>${data.list[i].dt_txt}</h3>
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
        }
      });
    } else {
      alert("Error:" + response.statusText);
    }
  });
};

// this is when the button is clicked the info is stored in local storage
var buttonClickHandler = function (event) {
  var getCity = event.target.getAttribute("cityName");
  console.log(getCity);
};

// form submit handler this is for the input of the city's in the form

var searchFormEl = document.querySelector("#search-form");
var cityNameInputEl = document.querySelector("#cityName");
var searchBtnEl = document.querySelector("#searchBtn");

var formSubmitHandler = function (event) {
  event.preventDefault();
  // let inputVal = input.value;
  var city = cityNameInputEl.value.trim();

  if (city) {
    getCityLatLon(city);
    mainCityNameEl.textContent = "";

    cityNameInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
  console.log(city, "city");
  getCityLatLon(city);
};

// form submit handler this is for the input of the city's in the form

var searchFormEl = document.querySelector("#search-form");
var cityNameInputEl = document.querySelector("#cityName");
var searchBtnEl = document.querySelector("#searchBtn");

// this will display the weather
var displayWeather = function () {};

// this will get the 5day weather cards
var fiveDayCard = document.querySelector("#fiveDayCard");
var getFiveWeatherCards = function () {};

searchFormEl.addEventListener("submit", formSubmitHandler);
searchBtnEl.addEventListener("click", buttonClickHandler);
