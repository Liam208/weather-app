const apiKey = CONFIG.API_KEY;

let temperature_C;
let temperature_F;
let current_condition;
let wind_mph;
let wind_kph;
let wind_dir;
let humidity;

// Get references to elements for easier access
const searchButton = document.querySelector("#search");
const spinner = document.querySelector("#spinner");
const notFoundAlert = document.querySelector("#notFound");
const reqErrAlert = document.querySelector("#reqErr");
const cityNameElement = document.querySelector("#cityname");
const tempElement = document.querySelector("#temp");
const windElement = document.querySelector("#wind");
const humidityElement = document.querySelector("#humidity");
const weatherIcon = document.getElementById("weather-icon");
const noCity = document.querySelector("#noCity")

function checkWords(text) {
  const words = text.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  if (words.length === 2) {
    const firstWord = words[0];
    const secondWord = words[1];

    const capFirst = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    const capSecond = secondWord.charAt(0).toUpperCase() + secondWord.slice(1);
    return `${capFirst} ${capSecond}`;
  }

  return text;
}

function changeParams(input) {
  const words = input.trim().split(/\s+/);
  if (words.length === 1) {
    return `q=${words[0]}`;
  } else {
    return `q=${words.join("+")}`;
  }
}


function resetUI() {
  notFoundAlert.classList.add("d-none");
  reqErrAlert.classList.add("d-none");
  noCity.classList.add("d-none")
  cityNameElement.textContent = "City Name"; 
  tempElement.textContent = "Temp"; 
  windElement.textContent = ""; 
  humidityElement.textContent = ""; 
  weatherIcon.src = "";
}

function getData(text) {
  resetUI();

  let citynameInput = text;
  let fullCityName = checkWords(citynameInput);
  let url_name = changeParams(citynameInput);
  let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&${url_name}`;

  searchButton.classList.add("d-none");
  spinner.classList.remove("d-none");

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404 || response.status === 400) {
          notFoundAlert.classList.remove("d-none");
          throw new Error(`Not Found Error! Status: ${response.status}`);
        } else if (response.status >= 500 && response.status < 600) {
          reqErrAlert.classList.remove("d-none");
          throw new Error(`Server Error! Status: ${response.status}`);
        } else {
          reqErrAlert.classList.remove("d-none");
          throw new Error(`HTTP ERROR: Status ${response.status}`);
        }
      }
      return response.json();
    })
    .then((data) => {

      if (data && data.current && data.location) {
        temperature_C = data.current.temp_c;
        temperature_F = data.current.temp_f;
        current_condition = data.current.condition.text; 
        wind_mph = data.current.wind_mph;
        wind_kph = data.current.wind_kph; 
        wind_dir = data.current.wind_dir; 
        humidity = data.current.humidity;
        let icon = data.current.condition.icon;
        let fullIconURL = "https:" + icon;


        cityNameElement.textContent = data.location.name; 
        tempElement.textContent = `${temperature_C} °C / ${temperature_F} °F`;
        windElement.textContent = `${wind_mph} MPH`; 
        humidityElement.textContent = `${humidity}%`; 
        weatherIcon.src = fullIconURL;


        notFoundAlert.classList.add("d-none");
        reqErrAlert.classList.add("d-none");
      } else {

        reqErrAlert.classList.remove("d-none");
        throw new Error("API returned unexpected data structure.");
      }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`); 
    })
    .finally(() => {

      searchButton.classList.remove("d-none");
      spinner.classList.add("d-none");
    });
}

document.getElementById("searchbox").addEventListener("submit", (e) => {
  e.preventDefault();
  let c_name = document.querySelector("#input-cityname").value;


  if (c_name.trim() !== "") {
    getData(c_name);
  } else {
    noCity.classList.remove("d-none")
    setTimeout(resetUI, 2500)
  }
});
