// Save city search history
function saveHistory(city){
let history = JSON.parse(localStorage.getItem("history")) || [];

if(!history.includes(city)){
history.push(city);
localStorage.setItem("history", JSON.stringify(history));
}

showHistory();
}

// Show history buttons
function showHistory(){
let history = JSON.parse(localStorage.getItem("history")) || [];
let historyDiv = document.getElementById("history");

historyDiv.innerHTML = "";

history.forEach(city => {
let btn = document.createElement("button");
btn.innerText = city;
btn.onclick = () => getWeather(city);
historyDiv.appendChild(btn);
});
}

// Get latitude & longitude from city
async function getWeather(cityInput){

let city = cityInput || document.getElementById("city").value;

saveHistory(city);

const geoURL =
`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

let geoResponse = await fetch(geoURL);
let geoData = await geoResponse.json();

let lat = geoData.results[0].latitude;
let lon = geoData.results[0].longitude;

fetchWeather(lat, lon, geoData.results[0].name);
}

// Fetch weather data
async function fetchWeather(lat, lon, cityName){

const weatherURL =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

let response = await fetch(weatherURL);
let data = await response.json();

// Current weather
document.getElementById("weather").innerHTML = `
<h2>${cityName}</h2>
<p>Temperature: ${data.current_weather.temperature} °C</p>
<p>Wind Speed: ${data.current_weather.windspeed} km/h</p>
<p>Time: ${data.current_weather.time}</p>
`;

// Forecast
let forecastDiv = document.getElementById("forecast");
forecastDiv.innerHTML = "";

for(let i=0;i<5;i++){

forecastDiv.innerHTML += `
<div class="forecast-day">
<p>${data.daily.time[i]}</p>
<p>Max: ${data.daily.temperature_2m_max[i]} °C</p>
<p>Min: ${data.daily.temperature_2m_min[i]} °C</p>
</div>
`;
}
}

// Detect user location
function getLocationWeather(){

navigator.geolocation.getCurrentPosition(async position => {

let lat = position.coords.latitude;
let lon = position.coords.longitude;

fetchWeather(lat, lon, "Your Location");

});
}

// Load history when page opens
showHistory();