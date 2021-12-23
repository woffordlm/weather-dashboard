var cityNameEl = document.querySelector("#left-column");
var cityInputEl = document.querySelector("#input-id");
var searchButton = document.querySelector("#search-button");
var APIKey = "10ffc784899a43da4d92a9e522ec8caf"
var clearButton = document.getElementById("clear-history");
var savedCityNames = []
var historyList = document.getElementById("listed-cities");
historyIndex = 0
var now = moment().format("L");
var timeEl = document.getElementById("city-date")
timeEl.textContent= now



// upon page load this function will fill the page with past searches pulling from local storage. 
// this function cycles through the array of objects in local storage
function fillHistory(){
    var savedCityNames=JSON.parse(localStorage.getItem("cityName")) || []
    console.log(savedCityNames.length)
    for (var i = 0; i < savedCityNames.length -1; i++) {
        console.log(savedCityNames[historyIndex].name)
        var storedName = savedCityNames[historyIndex].name;
        
        var listedCity = document.createElement("li");
        listedCity.setAttribute("class", "w-100")
        var historyButton = document.createElement("button")
        historyButton.setAttribute("class", "bg-primary text-white w-100 ")
        historyButton.textContent = storedName
        listedCity.appendChild(historyButton)
        historyList.appendChild(listedCity);
        historyIndex++
    }
}
// this function triggers fill history to load
window.onload = function () {
    fillHistory();
    cityPreLoad();
    
}
// this function gives functionality to the clear history button, by clearing local storage.
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
        // this loop fill the five day forecasts
        fiveDayIndex= 0
        daycounter = 1
        for (let i = 0; i < data.daily.length-3; i++) {
            
            var dailyTemp = data.daily[fiveDayIndex].temp.day;
            var dailyWind = data.daily[fiveDayIndex].wind_speed;
            var dailyHumidity = data.daily[fiveDayIndex].humidity;
            var dailyIcon = data.daily[fiveDayIndex].weather[0].icon;
            console.log(dailyIcon);
            console.log(fiveDayIndex);
            var dailyTempEl = document.getElementById("day-"+fiveDayIndex+"-temp");
            console.log(dailyTempEl);
            var dailyWindEl = document.getElementById("day-"+fiveDayIndex+"-wind");
            var dailyHumidityEl = document.getElementById("day-"+fiveDayIndex+"-humidity");
            var dailyDate = document.getElementById("day-" + fiveDayIndex + "-date")
            // var nowFiveDay = moment(now,"DD-MM_YYYY").add(daycounter, "days");
            // console.log(nowFiveDay);
            var now = moment();
            var dateDays = now.add(daycounter, "days");
            dateDays = dateDays.format("MM-DD-YYYY");
            console.log(dateDays);
            
            
            var dayOneIconEL = document.getElementById("day-"+ fiveDayIndex +"-icon");
            var dailyIconEl = document.createElement("img");
            dailyIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png");
            dayOneIconEL.appendChild(dailyIconEl);

            dailyDate.textContent = dateDays
            dailyTempEl.textContent = "Temp: " + dailyTemp + "°F";
            dailyWindEl.textContent = "Wind Speed: " + dailyWind + "mph";
            dailyHumidityEl.textContent = "Humidity: " + dailyHumidity + "%";
            fiveDayIndex++;
            daycounter++;
        }
            
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
            getFiveDay(data.coord.lat, data.coord.lon);
            
        })
}
function cityPreLoad(){
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
// this function is the event handler for the buttons in the recent history element
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


        // insert weather condtion icons into the 5 day section
// function getIcons(cityNames){
    
//     var requestIconUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityNames + "&appid=" + APIKey;
//     ; 
//     fetch(requestIconUrl)
//         .then(function (response){
//         return response.json();
//         })
//         .then(function(data){
//             console.log(data);
//         })
// }
