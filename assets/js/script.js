var cityNameEl = document.querySelector("#left-column");
var cityInputEl = document.querySelector("#input-id");
var searchButton = document.querySelector("#search-button");
var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=36.0971&lon=-80.4192&appid=10ffc784899a43da4d92a9e522ec8caf";
var APIKey = "10ffc784899a43da4d92a9e522ec8caf"
var clearButton = document.getElementById("clear-history");
var savedCityNames = []
var historyList = document.getElementById("listed-cities");
fiveDayIndex= 0
historyIndex = 0
var now = moment().format("LLLL");
var timeEl = document.getElementById("city-date")
timeEl.textContent= now


function fillHistory(){
    var savedCityNames=JSON.parse(localStorage.getItem("cityName")) || []
    console.log(savedCityNames.length)
    for (var i = 0; i < savedCityNames.length; i++) {
        console.log(savedCityNames[historyIndex].name)
        var storedName = savedCityNames[historyIndex].name;
        
        var listedCity = document.createElement("li");
        var historyButton = document.createElement("button")
        historyButton.textContent = storedName
        listedCity.appendChild(historyButton)
        historyList.appendChild(listedCity);
        // console.log(savedCityNames)
        historyIndex++
        
        
    }
}

window.onload = function () {
    fillHistory()
}
function clearHistory() {
    window.localStorage.removeItem("cityName");
    location.reload();
}


// this pulls data from the API endpoint with 5 day forecast data
function getFiveDay(lat, lon){
    
    var requestFiveDayUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey +"&units=imperial";
    ; 
    fetch(requestFiveDayUrl)
        .then(function (response){
        return response.json();
        })
        .then(function(data){
            console.log(data);
        // this section fills the UV index in the current weather div
        var currentUvIndex = document.getElementById('current-uv-index');  
        currentUvIndex.textContent = "UV Index: " + data.current.uvi 
        console.log(data.daily)
        // this series of for loops fill the five day forecasts
        // clear table

        for (let i = 0; i < data.daily.length-3; i++) {
            
            var dailyTemp = data.daily[fiveDayIndex].temp.day;
            var dailyWind = data.daily[fiveDayIndex].wind_speed;
            var dailyHumidity = data.daily[fiveDayIndex].humidity;
            console.log(fiveDayIndex);
            var dailyTempEl = document.getElementById("day-"+fiveDayIndex+"-temp");
            console.log(dailyTempEl);
            var dailyWindEl = document.getElementById("day-"+fiveDayIndex+"-wind");
            var dailyHumidityEl = document.getElementById("day-"+fiveDayIndex+"-humidity");
           
            
            dailyTempEl.textContent = "Temp: " + dailyTemp + "°F";
            dailyWindEl.textContent = "Wind Speed: " + dailyWind + "mph";
            dailyHumidityEl.textContent = "Humidity: " + dailyHumidity + "%";
            fiveDayIndex++;
        }
            fiveDayIndex= 0
        })
}
// this pulls data from the API endpoint with current weather data
function getCurrentWeatherData (cityEl){
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityEl + "&appid=" + APIKey +"&units=imperial";

    fetch(requestUrl)
        .then(function (response){
            
        return response.json();
        })
        .then(function (data){
            console.log(data)
            // this fills the current weather elements with the associate data.
            var currentTempEl= document.getElementById("current-temp");
            currentTempEl.textContent = "Temp: " + data.main.temp + "F"
            
            var currentWind = document.getElementById("current-wind");
            var currentHumidity = document.getElementById('current-humidity');
            var cityTitle = document.getElementById("city-title");
            cityTitle.textContent = data.name +" | " + now;
            currentWind.textContent = "Wind: " + data.wind.speed;
            currentHumidity.textContent = "Humidity: " + data.main.humidity;
            var iconEL = document.getElementById("current-icon")
            

           
            getFiveDay(data.coord.lat, data.coord.lon);
        })
       
}
    
// form submit handler
// this passes the input city name into different functions and saves the city name to local storage
function formSubmitHandler(event){
    event.preventDefault();
    fiveDayIndex=0
    var cityEl = cityInputEl.value.trim();
    if(cityEl){
        getCurrentWeatherData(cityEl);
        var cityInfo = {
            name: cityEl
        }
        var savedCityNames=JSON.parse(localStorage.getItem("cityName")) || []
        savedCityNames.push(cityInfo);
        localStorage.setItem("cityName", JSON.stringify(savedCityNames));
        cityInputEl.value = "";
        fillHistory();
    } else {
        alert("Please enter a City name.")
    }
}
function historyButtonFill(event){
    console.log(event.target)
    event.preventDefault();
    if(event.target.matches("button")){
        console.log(event.target.textContent)
        var foundText = event.target.textContent;
        console.log(foundText);
        getCurrentWeatherData(foundText);
       
    }

}
clearButton.addEventListener("click",clearHistory);
searchButton.addEventListener("click", formSubmitHandler);
historyList.addEventListener("click", historyButtonFill);




     
















// for (let i = 0; i < data.daily.length; i++) {
        //     console.log(data.daily[i].temp.day);
        //     var dailyTemp = data.daily[i].temp.day;
        //     var dailyWind = data.daily[i].wind_speed;
        //     var dailyHumidity = data.daily[i].humidity;
                
        //     var dailyTempOne = document.getElementById("day-two-temp");
        //     var dailyWindOne = document.getElementById("day-two-wind");
        //     var dailyHumidityOne = document.getElementById("day-two-humidity");
                
        //     dailyTempOne.innerHTML = "Temp: " + dailyTemp + "°F";
        //     dailyWindOne.innerHTML = "Wind Speed: " + dailyWind + "mph";
        //     dailyHumidityOne.innerHTML = "Humidity: " + dailyHumidity + "%";
        // }
        // for (let i = 0; i < data.daily.length; i++) {
        //     console.log(data.daily[i].temp.day);
        //     var dailyTemp = data.daily[i].temp.day;
        //     var dailyWind = data.daily[i].wind_speed;
        //     var dailyHumidity = data.daily[i].humidity;
                
        //     var dailyTempOne = document.getElementById("day-three-temp");
        //     var dailyWindOne = document.getElementById("day-three-wind");
        //     var dailyHumidityOne = document.getElementById("day-three-humidity");           
        //     dailyTempOne.innerHTML = "Temp: " + dailyTemp + "°F";
        //     dailyWindOne.innerHTML = "Wind Speed: " + dailyWind + "mph";
        //     dailyHumidityOne.innerHTML = "Humidity: " + dailyHumidity + "%";
        // } 
        // for (let i = 0; i < data.daily.length; i++) {
        //     console.log(data.daily[i].temp.day);
        //     var dailyTemp = data.daily[i].temp.day;
        //     var dailyWind = data.daily[i].wind_speed;
        //     var dailyHumidity = data.daily[i].humidity;
                
        //     var dailyTempOne = document.getElementById("day-three-temp");
        //     var dailyWindOne = document.getElementById("day-three-wind");
        //     var dailyHumidityOne = document.getElementById("day-three-humidity");
                    
        //     dailyTempOne.innerHTML = "Temp: " + dailyTemp + "°F";
        //     dailyWindOne.innerHTML = "Wind Speed: " + dailyWind + "mph";
        //     dailyHumidityOne.innerHTML = "Humidity: " + dailyHumidity + "%";    
        // }
        // for (let i = 0; i < data.daily.length; i++) {
        //     console.log(data.daily[i].temp.day);
        //     var dailyTemp = data.daily[i].temp.day;
        //     var dailyWind = data.daily[i].wind_speed;
        //     var dailyHumidity = data.daily[i].humidity;
                
        //     var dailyTempOne = document.getElementById("day-four-temp");
        //     var dailyWindOne = document.getElementById("day-four-wind");
        //     var dailyHumidityOne = document.getElementById("day-four-humidity");
                    
        //     dailyTempOne.innerHTML = "Temp: " + dailyTemp + "°F";
        //     dailyWindOne.innerHTML = "Wind Speed: " + dailyWind + "mph";
        //     dailyHumidityOne.innerHTML = "Humidity: " + dailyHumidity + "%";    
        // }
        // for (let i = 0; i < data.daily.length; i++) {
        //     console.log(data.daily[i].temp.day);
        //     var dailyTemp = data.daily[i].temp.day;
        //     var dailyWind = data.daily[i].wind_speed;
        //     var dailyHumidity = data.daily[i].humidity;
                
        //     var dailyTempOne = document.getElementById("day-five-temp");
        //     var dailyWindOne = document.getElementById("day-five-wind");
        //     var dailyHumidityOne = document.getElementById("day-five-humidity");
                    
        //     dailyTempOne.innerHTML = "Temp: " + dailyTemp + "°F";
        //     dailyWindOne.innerHTML = "Wind Speed: " + dailyWind + "mph";
        //     dailyHumidityOne.innerHTML = "Humidity: " + dailyHumidity + "%";    
        // }