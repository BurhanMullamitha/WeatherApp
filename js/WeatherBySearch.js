const api_key = "143de8ba913c997cadf64d3d59f13c63";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var currentWeatherArray = {};
var weatherForecastArray = {};
var cityID = "";

function formatAMPM(date) {
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    var strTime = hours + ' ' + ampm;
    return strTime;
}

var getTempIcon = {
    "01d": "images/clearSky.png",
    "01n": "images/clearSky.png",
    "02d": "images/fewClouds.png",
    "02n": "images/fewClouds.png",
    "03d": "images/scatteredClouds.png",
    "03n": "images/scatteredClouds.png",
    "04d": "images/brokenClouds.png",
    "04n": "images/brokenClouds.png",
    "09d": "images/showerRain.png",
    "09n": "images/showerRain.png",
    "10d": "images/rain.png",
    "10n": "images/rain.png",
    "11d": "images/thunderstorm.png",
    "11n": "images/thunderstorm.png",
    "13d": "images/snow.png",
    "13n": "images/snow.png",
    "50d": "images/mist.png",
    "50n": "images/mist.png",
}

var day1 = new Date();
var day2 = new Date(); day2.setDate(day1.getDate() + 1);
var day3 = new Date(); day3.setDate(day2.getDate() + 1);
var day4 = new Date(); day4.setDate(day3.getDate() + 1);
var day5 = new Date(); day5.setDate(day4.getDate() + 1);
var day6 = new Date(); day6.setDate(day5.getDate() + 1);
var dateArray = [day1.getDate(), day2.getDate(), day3.getDate(), day4.getDate(), day5.getDate(), day6.getDate()];
var dayArray = [day1.getDay(), day2.getDay(), day3.getDay(), day4.getDay(), day5.getDay(), day6.getDay()];

function getWeatherByLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
        alert("Geolocation is not supported by this browser!");
}

function showPosition(position) {
    var url = "https://api.opencagedata.com/geocode/v1/json?key=71148203bcb445e0ad807378213a287a&q=" + 
    position.coords.latitude + "," + position.coords.longitude + "&pretty=1&no_annotations=1";

    fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            var state = data.results["0"].components.state;
            var country = data.results["0"].components.country;
            var address = state + ", " + country;
            document.getElementById("location").value = address;
            getWeather(address);
            getForecastWeather(address);
            
        })
}

function getWeather(location) {
    var unit = document.getElementById('switcher-1').checked ? 'metric' : 'imperial';
    var unitSymbol = document.getElementById('switcher-1').checked ? '&#8451;' : '&#8457;';
    
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + location +"&appid="+ api_key +"&mode=xml&units=" + unit;

    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var weatherData = this.responseXML;

            const city = weatherData.getElementsByTagName("current")[0].childNodes[0].getAttribute("name");
            currentWeatherArray["city"] = city;
            document.querySelector("#city-name").innerHTML = city;
            const country = weatherData.getElementsByTagName("current")[0].childNodes[0].childNodes[1].textContent;
            currentWeatherArray["country"] = country;
            const sunrise = weatherData.getElementsByTagName("current")[0].childNodes[0].childNodes[3].getAttribute("rise");
            currentWeatherArray["sunrise"] = sunrise;
            const sunset = weatherData.getElementsByTagName("current")[0].childNodes[0].childNodes[3].getAttribute("set");
            currentWeatherArray["sunset"] = sunset;
            const temp = weatherData.getElementsByTagName("current")[0].childNodes[1].getAttribute("value");
            currentWeatherArray["temp"] = parseInt(temp);
            const min_temp = weatherData.getElementsByTagName("current")[0].childNodes[1].getAttribute("min");
            currentWeatherArray["min_temp"] = min_temp;
            const max_temp = weatherData.getElementsByTagName("current")[0].childNodes[1].getAttribute("max");
            currentWeatherArray["max_temp"] = max_temp;
            const unit = weatherData.getElementsByTagName("current")[0].childNodes[1].getAttribute("unit");
            currentWeatherArray["unit"] = unit;
            const wind_speed = weatherData.getElementsByTagName("current")[0].childNodes[5].childNodes[0].getAttribute("value");
            currentWeatherArray["wind_speed"] = wind_speed + "m/s";
            const prep = weatherData.getElementsByTagName("current")[0].childNodes[7].getAttribute("value");
            currentWeatherArray["prep"] = prep;
            const weather_title = weatherData.getElementsByTagName("current")[0].childNodes[8].getAttribute("value");
            currentWeatherArray["weather_title"] = weather_title;
            const icon = weatherData.getElementsByTagName("current")[0].childNodes[9].getAttribute("icon");
            currentWeatherArray["icon"] = icon;

            var currentDate = new Date();
            document.querySelector(".today").textContent = "Today";
            document.querySelector(".today-date").textContent = days[currentDate.getDay()] + ", " + currentDate.getDate() + " " + months[currentDate.getMonth()];
            document.querySelector("#day1 #current-date-wrapper #icon-div #weatherImg").src = getTempIcon[currentWeatherArray.icon];
            document.querySelector(".temp-main").innerHTML = currentWeatherArray["temp"] + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
            document.querySelector(".address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];

            var sunriseTime = new Date(currentWeatherArray["sunrise"]);
            var sunsetTime = new Date(currentWeatherArray["sunset"]);

            document.querySelector(".sunrise").textContent = "Sunrise " + sunriseTime.getHours() + ":" + sunriseTime.getMinutes();
            document.querySelector(".sunset").textContent = "Sunset " + sunsetTime.getHours() + ":" + sunsetTime.getMinutes();

        }
    };
    request.open("GET", url, true);
    request.send();
}


function getForecastWeather(location) {

    var unit = document.getElementById('switcher-1').checked ? 'metric' : 'imperial';
    var unitSymbol = document.getElementById('switcher-1').checked ? '&#8451;' : '&#8457;';

    const url = "https://api.openweathermap.org/data/2.5/forecast?q="+ location +"&mode=xml&appid="+ api_key +"&units=" + unit;

    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            var forecastData = this.responseXML;

            var weatherForecast = forecastData.getElementsByTagName("weatherdata")[0].childNodes[4].childNodes;
            for(var i=0; i<weatherForecast.length; i++) {
                weatherForecastArray[i] = {};
                weatherForecastArray[i]["from"] = new Date(weatherForecast[i].getAttribute("from"));
                weatherForecastArray[i]["to"] = new Date(weatherForecast[i].getAttribute("to"));
                weatherForecastArray[i]["weather_title"] = weatherForecast[i].childNodes[0].getAttribute("name");
                weatherForecastArray[i]["icon"] = weatherForecast[i].childNodes[0].getAttribute("var");
                weatherForecastArray[i]["weather_title"] = weatherForecast[i].childNodes[0].getAttribute("name");
                weatherForecastArray[i]["wind_speed"] = weatherForecast[i].childNodes[3].getAttribute("mps");
                weatherForecastArray[i]["temp"] = Math.round(weatherForecast[i].childNodes[4].getAttribute("value") * 10) / 10;
                weatherForecastArray[i]["max_temp"] = weatherForecast[i].childNodes[4].getAttribute("max");
                weatherForecastArray[i]["min_temp"] = weatherForecast[i].childNodes[4].getAttribute("min");
                weatherForecastArray[i]["humidity"] = weatherForecast[i].childNodes[6].getAttribute("value");
            }

            var day1 = new Date();
            var day2 = new Date(); day2.setDate(day1.getDate() + 1);
            var day3 = new Date(); day3.setDate(day2.getDate() + 1);
            var day4 = new Date(); day4.setDate(day3.getDate() + 1);
            var day5 = new Date(); day5.setDate(day4.getDate() + 1);
            var day6 = new Date(); day6.setDate(day5.getDate() + 1);
            var dateArray = [day1.getDate(), day2.getDate(), day3.getDate(), day4.getDate(), day5.getDate(), day6.getDate()];

            for(i=1; i<=dateArray.length; i++) {
                var dayElement = "#day" + i + " > .time_pred";
                var dayArea = document.querySelector(dayElement);
                while(dayArea.hasChildNodes()){
                    dayArea.removeChild(dayArea.lastChild);
                }
            }   
 
            var temp_main_day3 = 0; var day3_count = 0;
            var temp_main_day4 = 0; var day4_count = 0;
            var temp_main_day2 = 0; var day2_count = 0;
            var temp_main_day5 = 0; var day5_count = 0;
            var temp_main_day6 = 0; var day6_count = 0;
            

            for(var i=0; i<=39; i++) {
                
                if (weatherForecastArray[i]["from"].getDate() == dateArray[0]) {
                    document.querySelector("#day1 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#day1 > .time_pred").childNodes;
                    for(var j=0; j<timeDivs.length; j++) {
                    timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[1]) {
                    day2_count+=1;
                    temp_main_day2 += weatherForecastArray[i].temp;
                    var dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#day2 #tomorrow-date-wrapper #tomorrow-date-details .day-name").textContent = "Tomorrow";
                    document.querySelector("#day2 #tomorrow-date-wrapper #tomorrow-date-details .date").textContent = days[dt.getDay()] + ", " + dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#day2 .temp-forecast-main").innerHTML = parseInt(temp_main_day2 / day2_count) + "<sup style='font-size: 20px;'>" + unitSymbol +"</sup>";
                    document.querySelector("#day2 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#day2 #tomorrow-date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i].icon];
                    
                    document.querySelector("#day2 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#day2 > .time_pred").childNodes;
                    for(var j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[2]) {
                    day3_count+=1;
                    temp_main_day3 += weatherForecastArray[i].temp;

                    var dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#day3 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#day3 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#day3 .temp-forecast-main").innerHTML = parseInt(temp_main_day3 / day3_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#day3 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#day3 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#day3 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#day3 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[3]) {
                    day4_count+=1;
                    temp_main_day4 += weatherForecastArray[i].temp;

                    var dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#day4 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#day4 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#day4 .temp-forecast-main").innerHTML = parseInt(temp_main_day4 / day4_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#day4 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#day4 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#day4 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#day4 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[4]) {
                    day5_count+=1;
                    temp_main_day5 += weatherForecastArray[i].temp;

                    var dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#day5 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#day5 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#day5 .temp-forecast-main").innerHTML = parseInt(temp_main_day5 / day5_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#day5 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#day5 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#day5 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#day5 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[5]) {
                    day6_count+=1;
                    temp_main_day6 += weatherForecastArray[i].temp;
                    var dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#day6 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#day6 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#day6 .temp-forecast-main").innerHTML = parseInt(temp_main_day6 / day6_count) + "<sup style='font-size: 20px;'>" + unitSymbol +"</sup>";
                    document.querySelector("#day6 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#day6 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#day6 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#day6 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

            }
            // End of For Loop

            var timeNodes = document.getElementsByClassName("timelyWeatherWrapper");
            for(var i=0; i<=39; i++) {
                spanEl = timeNodes[i].appendChild(document.createElement("span"));
                spanEl.classList.add("time");
                spanEl.innerHTML = formatAMPM(weatherForecastArray[i]["from"]);

                iconEl = timeNodes[i].appendChild(document.createElement("span"));
                iconEl.classList.add("weatherTimeIcons");
                var imgUrl = "http://openweathermap.org/img/wn/" + weatherForecastArray[i]["icon"] + ".png";
                iconEl.innerHTML = "<img src=" + imgUrl +">";

                spanEl = timeNodes[i].appendChild(document.createElement("span"));
                spanEl.classList.add("temp-forecast");
                spanEl.innerHTML = weatherForecastArray[i]["temp"] + "<sup style='font-size: 10px;'>" + unitSymbol +"</sup>";
            }
        }
        
    }  
    request.open("GET",  url, true);
    request.send();
}