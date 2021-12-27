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
function fillHistory(cityEl){
    var savedCityNames=JSON.parse(localStorage.getItem("cityName")) || []
    console.log(savedCityNames[1].name.toLowerCase())
     // condtional preventing adding same city to history multiple times
 
          console.log(cityEl)
        for (var i = 0; i < savedCityNames.length; i++) {
            // if(savedCityNames[i].name.toLowerCase() != cityEl.toLowerCase()) { 
                // if(!$.inArray(value, array))array.push(value);


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
    // cityPreLoad();
    
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
        console.log(data.current.uvi);
        // color code the UVI index

        if (data.current.uvi  >= 1 || data.current.uvi <=2){
            currentUvIndex.style.backgroundColor = "green";
            currentUvIndex.style.width = "25%";
        }
        if (data.current.uvi  >= 1 || data.current.uvi <=2){
            currentUvIndex.style.backgroundColor = "green";
            currentUvIndex.style.width = "25%";
        }
        if (data.current.uvi  >= 3 && data.current.uvi <=5){
            currentUvIndex.style.backgroundColor = "yellow";
            currentUvIndex.style.width = "25%";
        }
        if (data.current.uvi  >= 6 && data.current.uvi <=7){
            currentUvIndex.style.backgroundColor = "orange";
            currentUvIndex.style.width = "25%";
        }
        if (data.current.uvi  >= 8 && data.current.uvi <=10){
            currentUvIndex.style.backgroundColor = "red";
            currentUvIndex.style.width = "25%";
        }
        if (data.current.uvi  >= 11){
            currentUvIndex.style.backgroundColor = "purple";
            currentUvIndex.style.width = "25%";
        }

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
            dayOneIconEL.innerText="";
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

// this function will fill the page with information upon load.
// this is currently commented out in case the developer wishes to provide this function
// function cityPreLoad(){
//     fiveDayIndex=0
//     var cityEl = cityInputEl.value.trim();
//     if(cityEl){
//         getCurrentWeatherData(cityEl);
//         var cityInfo = {
//             name: cityEl
//         }
//         var savedCityNames=JSON.parse(localStorage.getItem("cityName")) || []
//         savedCityNames.push(cityInfo);
//         localStorage.setItem("cityName", JSON.stringify(savedCityNames));
//         cityInputEl.value = "";
//         fillHistory(cityEl);
//     } else {
//         alert("Please enter a City name.")
//     }
// }
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


//figure out a way to prevent the same city from duplicating history
