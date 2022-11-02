// prompt user to type in city
// assign city name to city parameter
// find 5 day forecast of that specific latitude and longitude
// display current weather forecast (temperature,wind and humidity) below the header
// display the weather forecast for the next 5 days (temperature,wind and humidity) below the current weather forecast

var londonWeather = 'api.openweathermap.org/data/2.5/forecast?q=London&appid=e39d6eb5facbd4f8244a672d51ea14b0';
fetch(londonWeather)