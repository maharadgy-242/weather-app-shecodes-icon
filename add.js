function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2" id="forecast-block">
      <div class="weather-forecast-days">${formatDays(forecastDay.time)}</div>
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDay.condition.icon
      }.png" alt="" width="42" id="weather-forecast-days-image" />
      <div class="weather-forecast-temperature">
        <span class="weather-forecast-temperature-max">${Math.round(
          forecastDay.temperature.maximum
        )}°</span>
        <span class="weather-forecast-temperature-min">${Math.round(
          forecastDay.temperature.minimum
        )}°</span>
      </div>
    </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getDaysForecast(coordinates) {
  let apiKey = "45ff3bef6edo435d3cfa0a0373c85ct7";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.city;

  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = response.data.condition.description;

  let feelLikeElement = document.querySelector("#feels-like");
  feelLikeElement.innerHTML = Math.round(response.data.temperature.feels_like);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.temperature.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.time * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  iconElement.setAttribute("alt", response.data.condition.description);

  celsiusTemp = Math.round(response.data.temperature.current);

  getDaysForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "45ff3bef6edo435d3cfa0a0373c85ct7";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function showFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiustLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let FahrenheitTemperature = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(FahrenheitTemperature);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiustLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = celsiusTemp;
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiustLink = document.querySelector("#celsius-link");
celsiustLink.addEventListener("click", showCelsiusTemp);

search("Kalmar");
