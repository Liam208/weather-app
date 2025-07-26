const apiKey = CONFIG.API_KEY

let temperature_C;
let temperature_F;
let current_condition;
let wind_mph;
let wind_kph;
let wind_dir;
let humidity;

function checkWords(text){
  const words = text.trim().split(" ")
  if (words.length === 1){
    return words[0].charAt(0).toUpperCase() + words[0].slice(1)

  }
  if (words.length === 2) {
    const firstWord = words[0]
    const secondWord = words[1]

    const capFirst = firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    const capSecond = secondWord.charAt(0).toUpperCase() + secondWord.slice(1)
    return `${capFirst} ${capSecond}`
  }
  return text;
}

function changeParams(input) {
  const words = input.trim().split(/\s+/)
  if (words.length == 1) {
    return `q=${words[0]}`
  } else {
    return `q=${words.join('+')}`
  }
}

function getData(text) {
  let cityname = text;
  let fullCityName = checkWords(cityname)
  let url_name = changeParams(text)
  let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&${url_name}`;

  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      temperature_C = data.current.temp_c;
      temperature_F = data.current.temp_f;
      current_condition = data.current.condition.text;
      wind_mph = data.current.wind_mph;
      wind_kph = data.current.wind_kph;
      wind_dir = data.current.wind_dir;
      humidity = data.current.humidity;
      let icon = data.current.condition.icon;
      let fullIconURL= "https:" + icon

      document.querySelector("#cityname").textContent = fullCityName;
      document.querySelector("#temp").textContent = temperature_C + " °C";

      document.querySelector("#wind").textContent = wind_mph + "MPH";
      document.querySelector("#humidity").textContent = humidity;
      document.getElementById("weather-icon").src = fullIconURL;

      
      // console.log("Current temperature in Celsius is: " + temperature_C )
      // console.log("Current temperature in F is: " + temperature_F )
      // console.log("Current text is: " + text)
      // console.log("Current wind MPH is: " + wind_mph)
      // console.log("Current wind KPH is: " + wind_kph)
      // console.log("Current wind direction is: " + wind_dir)
      // console.log("Current humidity is: " + humidity)
    });
}

document.querySelector("#search").addEventListener("click", () => {
  let c_name = document.querySelector("#input-cityname").value;

  console.log(c_name)
  getData(c_name);
});
