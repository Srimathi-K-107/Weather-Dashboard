// let apiKey = "ceccf393284b29313f178d4475f45be8";
const API_KEY = "ceccf393284b29313f178d4475f45be8";

// ================= ELEMENTS =================

const search = document.getElementById("search");
const searchbtn = document.getElementById("searchbtn");
const currentlocationbtn = document.getElementById("currentlocationbtn");

const degreecelsius = document.getElementById("degreecelsius");

const haze = document.getElementById("haze");
const date = document.getElementById("date");
const locationn = document.getElementById("location");
const forecast = document.getElementById("forecast");

const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");
const so2 = document.getElementById("so2");
const co = document.getElementById("co");
const no = document.getElementById("no");
const no2 = document.getElementById("no2");
const nh3 = document.getElementById("nh3");
const o3 = document.getElementById("o3");

const airstatus = document.getElementById("airstatus");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const wind = document.getElementById("wind");
const feels = document.getElementById("feels");

const hourly = document.getElementById("hourly");

// ================= SEARCH =================

searchbtn.addEventListener("click", () => {
  const city = search.value.trim();

  if (!city) {
    alert("Please enter city name");
    return;
  }

  getWeather(city);
});

// ================= ENTER KEY =================

search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(search.value.trim());
  }
});

// ================= CURRENT LOCATION =================

currentlocationbtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeatherByCoordinates(lat, lon);
    },

    (error) => {
      console.log(error);

      alert("Please allow location permission");
    },
  );
});

// ================= GET WEATHER BY CITY =================

async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    console.log("Current Weather:", data);

    if (!response.ok) {
      throw new Error(data.message || "Weather data not found");
    }

    displayCurrentWeather(data);

    // Forecast

    getForecast(data.coord.lat, data.coord.lon);

    // Air Quality

    getAirQuality(data.coord.lat, data.coord.lon);
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

// ================= GET WEATHER BY LOCATION =================

async function getWeatherByCoordinates(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    console.log("Location Weather:", data);

    if (!response.ok) {
      throw new Error(data.message || "Unable to get weather");
    }

    displayCurrentWeather(data);

    getForecast(lat, lon);

    getAirQuality(lat, lon);
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
}

// ================= DISPLAY CURRENT WEATHER =================

function displayCurrentWeather(data) {
  degreecelsius.innerText = `${data.main.temp.toFixed(2)}°C`;

  haze.innerText = data.weather[0].description;

  locationn.innerText = `${data.name}, ${data.sys.country}`;

  const currentDate = new Date();

  date.innerText = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  humidity.innerText = `${data.main.humidity}%`;

  pressure.innerText = `${data.main.pressure} hPa`;

  visibility.innerText = `${(data.visibility / 1000).toFixed(1)} km`;

  wind.innerText = `${data.wind.speed.toFixed(2)} m/s`;

  feels.innerText = `${data.main.feels_like.toFixed(2)}°C`;

  sunrise.innerText = formatTime(data.sys.sunrise);

  sunset.innerText = formatTime(data.sys.sunset);
}

// ================= FORMAT TIME =================

function formatTime(timestamp) {
  const time = new Date(timestamp * 1000);

  return time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ================= 5 DAYS FORECAST =================

async function getForecast(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    console.log("Forecast:", data);

    if (!response.ok) {
      throw new Error(data.message || "Forecast error");
    }

    displayForecast(data.list);

    displayHourly(data.list);
  } catch (error) {
    console.error(error);
  }
}

// ================= DISPLAY FORECAST =================

function displayForecast(list) {
  forecast.innerHTML = "";

  const days = {};

  list.forEach((item) => {
    const day = item.dt_txt.split(" ")[0];

    if (!days[day]) {
      days[day] = item;
    }
  });

  const forecastDays = Object.values(days).slice(0, 5);

  forecastDays.forEach((item) => {
    const dateObj = new Date(item.dt * 1000);

    const dayName = dateObj.toLocaleDateString("en-IN", {
      weekday: "long",
    });

    const dateName = dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

    const icon = item.weather[0].icon;

    forecast.innerHTML += `

            <div class="forecast-row">

                <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="weather"
                >

                <span class="forecast-temp">
                    ${item.main.temp.toFixed(2)}°C
                </span>

                <span class="forecast-date">
                    ${dateName}
                </span>

                <span class="forecast-day">
                    ${dayName}
                </span>

            </div>

        `;
  });
}

// ================= HOURLY =================

function displayHourly(list) {
  hourly.innerHTML = "";

  const hours = list.slice(0, 8);

  hours.forEach((item) => {
    const time = new Date(item.dt * 1000);

    const hour = time.toLocaleTimeString("en-IN", {
      hour: "numeric",
    });

    const icon = item.weather[0].icon;

    hourly.innerHTML += `

            <div class="hour-card">

                <p>${hour}</p>

                <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="weather"
                >

                <strong>
                    ${item.main.temp.toFixed(2)}°C
                </strong>

            </div>

        `;
  });
}

// ================= AIR QUALITY =================

async function getAirQuality(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    console.log("Air Quality:", data);

    if (!response.ok) {
      throw new Error(data.message || "Air quality error");
    }

    const pollution = data.list[0];

    const components = pollution.components;

    pm25.innerText = components.pm2_5.toFixed(2);

    pm10.innerText = components.pm10.toFixed(2);

    so2.innerText = components.so2.toFixed(2);

    co.innerText = components.co.toFixed(2);

    no.innerText = components.no.toFixed(2);

    no2.innerText = components.no2.toFixed(2);

    nh3.innerText = components.nh3.toFixed(2);

    o3.innerText = components.o3.toFixed(2);

    setAirStatus(pollution.main.aqi);
  } catch (error) {
    console.error(error);
  }
}

// ================= AQI STATUS =================

function setAirStatus(aqi) {
  if (aqi === 1) {
    airstatus.innerText = "Good";
  } else if (aqi === 2) {
    airstatus.innerText = "Fair";
  } else if (aqi === 3) {
    airstatus.innerText = "Moderate";
  } else if (aqi === 4) {
    airstatus.innerText = "Poor";
  } else if (aqi === 5) {
    airstatus.innerText = "Very Poor";
  }
}

// ================= DEFAULT WEATHER =================

// getWeather("Chennai");
window.addEventListener("load", () => {
  currentlocationbtn.click();
});
