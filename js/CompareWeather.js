var cityID = "";

function resetValues() {
    document.getElementById('cityLeftLocation').value = "";
    document.getElementById('cityRightLocation').value = "";
    document.querySelector('#compareCity1 #gpsDiv').style.display = "block";
    document.querySelector('#compareCity2 #gpsDiv').style.display = "block";
    document.getElementById("selectedDay").selectedIndex = 0;

    const cardArray = ["#compareCity1", "#compareCity2"];
    for(let i = 1; i <= 6; i++) {
        const firstCityId = "firstCityDay" + i;
        const secondCityId = "secondCityDay" + i;
        document.getElementById(firstCityId).style.display = "none";
        document.getElementById(secondCityId).style.display = "none";
    }

    document.getElementById('firstCityDay1').style.display = "block";
    document.getElementById('secondCityDay1').style.display = "block";


    for(let i = 0; i < cardArray.length; i++) {
        document.querySelectorAll(cardArray[i] + " #weatherImg").src = "";
        document.querySelector(cardArray[i] + " .today").innerHTML = "Today";
        document.querySelector(cardArray[i] + " .today-date").innerHTML = "xx Month";
        document.querySelector(cardArray[i] + " .temp-main").innerHTML = "X" + "<sup style='font-size: 20px;'>&#8451;</sup>";
        document.querySelector(cardArray[i] + " .address").innerHTML = "City, Country";
        document.querySelector(cardArray[i] + " .sunrise").innerHTML = "Sunrise hh:mm";
        document.querySelector(cardArray[i] + " .sunset").innerHTML = "Sunset hh:mm";        
    }

    for(let i = 0; i < cardArray.length; i++) {
        let dayArea = document.querySelector(cardArray[i] + " .time_pred");
        while(dayArea.hasChildNodes()){
            dayArea.removeChild(dayArea.lastChild);
        }
    } 
}

function showSelectedDay() {
    if((document.getElementById('cityLeftLocation').value == "") || document.getElementById('cityRightLocation').value == ""){
        return;
    }
    const dayNumber = document.getElementById('selectedDay').selectedIndex + 1;
    for(let i = 1; i <= 6; i++) {
        const firstCityId = "firstCityDay" + i;
        const secondCityId = "secondCityDay" + i;
        document.getElementById(firstCityId).style.display = "none";
        document.getElementById(secondCityId).style.display = "none";
    }
    document.getElementById("firstCityDay" + dayNumber).style.display = "block";
    document.getElementById("secondCityDay" + dayNumber).style.display = "block";
}


function getCityWeatherByLocation(id) {
    cityID = id;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
        alert('Geolocation is not supported by this browser.');
}

function showPosition(position) {
    const url = "https://api.opencagedata.com/geocode/v1/json?key=71148203bcb445e0ad807378213a287a&q=" + position.coords.latitude + "," + position.coords.longitude + "&pretty=1&no_annotations=1";

    fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            const state = data.results["0"].components.state;
            const country = data.results["0"].components.country;
            const address = state + ", " + country;
            document.getElementById("location").value = address;
            
            if(cityID == "city1") {
                document.getElementById("cityLeftLocation").value = address;
                document.querySelector("#compareCity2 #gpsDiv").style.display = "none";
                getFirstCityWeather(address);
            }
            else if(cityID == "city2") {
                document.getElementById("cityRightLocation").value = address;
                document.querySelector("#compareCity1 #gpsDiv").style.display = "none";
                getSecondCityWeather(address);
            }
        })
}


function onCityChangeUnit() {
    document.getElementById('cityLeftLocation').value ? getFirstCityWeather(document.getElementById('cityLeftLocation').value) : "";
    document.getElementById('cityRightLocation').value ? getSecondCityWeather(document.getElementById('cityRightLocation').value) : "";
}

function getFirstCityWeather(location) {

    if(document.getElementById('cityLeftLocation').value == ''){
        alert("Please Enter Valid Location!");
        return;
    }
    if(document.getElementById('cityRightLocation').value == location){
        alert("Same Location Entered! Try Again!");
        return;
    }

    const unit = document.getElementById('switcher-2').checked ? 'metric' : 'imperial';
    const unitSymbol = document.getElementById('switcher-2').checked ? '&#8451;' : '&#8457;';

    const current_url = "https://api.openweathermap.org/data/2.5/weather?q=" + location +"&appid="+ api_key +"&mode=xml&units=" + unit;

    const current_weather_request = new XMLHttpRequest();
    current_weather_request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const weatherData = this.responseXML;

            const city = weatherData.getElementsByTagName("current")[0].childNodes[0].getAttribute("name");
            currentWeatherArray["city"] = city;
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

            const currentDate = new Date();
            document.querySelector("#firstCityDay1 .today").textContent = "Today";
            document.querySelector("#firstCityDay1 .today-date").textContent = days[currentDate.getDay()] + ", " + currentDate.getDate() + " " + months[currentDate.getMonth()];
            document.querySelector("#firstCityDay1 #current-date-wrapper #icon-div #weatherImg").src = getTempIcon[currentWeatherArray.icon];
            document.querySelector("#firstCityDay1 .temp-main").innerHTML = currentWeatherArray["temp"] + "<sup style='font-size: 20px;'>"+ unitSymbol +"</sup>";
            document.querySelector("#firstCityDay1 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];

            const sunriseTime = new Date(currentWeatherArray["sunrise"]);
            const sunsetTime = new Date(currentWeatherArray["sunset"]);

            document.querySelector("#firstCityDay1 .sunrise").textContent = "Sunrise " + sunriseTime.getHours() + ":" + sunriseTime.getMinutes();
            document.querySelector(" #firstCityDay1 .sunset").textContent = "Sunset " + sunsetTime.getHours() + ":" + sunsetTime.getMinutes();

        }
    };
    current_weather_request.open("GET", current_url, true);
    current_weather_request.send();


    // Forecast City 1
    const forecast_url = "https://api.openweathermap.org/data/2.5/forecast?q="+ location +"&mode=xml&appid="+ api_key +"&units=" + unit;

    const forecast_weather_request = new XMLHttpRequest();
    forecast_weather_request.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            const forecastData = this.responseXML;
            const weatherForecast = forecastData.getElementsByTagName("weatherdata")[0].childNodes[4].childNodes;

            const weatherForecastArray = {};
            
            for(let i=0; i<weatherForecast.length; i++) {
                weatherForecastArray[i] = {};
                weatherForecastArray[i]["from"] = new Date(weatherForecast[i].getAttribute("from"));
                weatherForecastArray[i]["to"] = new Date(weatherForecast[i].getAttribute("to"));
                weatherForecastArray[i]["weather_title"] = weatherForecast[i].childNodes[0].getAttribute("name");
                weatherForecastArray[i]["icon"] = weatherForecast[i].childNodes[0].getAttribute("var");
                weatherForecastArray[i]["weather_title"] = weatherForecast[i].childNodes[0].getAttribute("name");
                weatherForecastArray[i]["wind_speed"] = weatherForecast[i].childNodes[3].getAttribute("mps") + "m/s";
                weatherForecastArray[i]["temp"] = Math.round(weatherForecast[i].childNodes[4].getAttribute("value") * 10) / 10;
                weatherForecastArray[i]["max_temp"] = weatherForecast[i].childNodes[4].getAttribute("max");
                weatherForecastArray[i]["min_temp"] = weatherForecast[i].childNodes[4].getAttribute("min");
            }

            
            for(i=1; i<=dateArray.length; i++) {
                const dayElement = "#firstCityDay" + i + " > .time_pred";
                const dayArea = document.querySelector(dayElement);
                while(dayArea.hasChildNodes()){
                    dayArea.removeChild(dayArea.lastChild);
                }
            }   
 
            let temp_main_day3 = 0; let day3_count = 0;
            let temp_main_day4 = 0; let day4_count = 0;
            let temp_main_day2 = 0; let day2_count = 0;
            let temp_main_day5 = 0; let day5_count = 0;
            let temp_main_day6 = 0; let day6_count = 0;
            

            for(let i=0; i<=39; i++) {
                if (weatherForecastArray[i]["from"].getDate() == dateArray[0]) {
                    document.querySelector("#firstCityDay1 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#firstCityDay1 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                    timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[1]) {
                    day2_count+=1;
                    temp_main_day2 += weatherForecastArray[i].temp;
                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#firstCityDay2 #tomorrow-date-wrapper #tomorrow-date-details .day-name").textContent = "Tomorrow";
                    document.querySelector("#firstCityDay2 #tomorrow-date-wrapper #tomorrow-date-details .date").textContent = days[dt.getDay()] + ", " + dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#firstCityDay2 .temp-forecast-main").innerHTML = parseInt(temp_main_day2 / day2_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#firstCityDay2 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#firstCityDay2 #tomorrow-date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i].icon];
                    
                    document.querySelector("#firstCityDay2 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#firstCityDay2 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }
                

                if (weatherForecastArray[i]["from"].getDate() == dateArray[2]) {
                    day3_count+=1;
                    temp_main_day3 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#firstCityDay3 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#firstCityDay3 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#firstCityDay3 .temp-forecast-main").innerHTML = parseInt(temp_main_day3 / day3_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#firstCityDay3 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#firstCityDay3 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];


                    document.querySelector("#firstCityDay3 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#firstCityDay3 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[3]) {
                    day4_count+=1;
                    temp_main_day4 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#firstCityDay4 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#firstCityDay4 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#firstCityDay4 .temp-forecast-main").innerHTML = parseInt(temp_main_day4 / day4_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#firstCityDay4 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#firstCityDay4 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#firstCityDay4 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#firstCityDay4 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[4]) {
                    day5_count+=1;
                    temp_main_day5 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#firstCityDay5 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#firstCityDay5 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#firstCityDay5 .temp-forecast-main").innerHTML = parseInt(temp_main_day5 / day5_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#firstCityDay5 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#firstCityDay5 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#firstCityDay5 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#firstCityDay5 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[5]) {
                    day6_count+=1;
                    temp_main_day6 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#firstCityDay6 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#firstCityDay6 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#firstCityDay6 .temp-forecast-main").innerHTML = parseInt(temp_main_day6 / day6_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#firstCityDay6 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#firstCityDay6 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#firstCityDay6 > .time_pred").appendChild(document.createElement("div"));
                    let timeDivs = document.querySelector("#firstCityDay6 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

            }
            // End of For Loop

            const timeNodes = document.querySelectorAll("#compareCity1 .timelyWeatherWrapper");
            for(let i=0; i<=39; i++) {
                spanEl = timeNodes[i].appendChild(document.createElement("span"));
                spanEl.classList.add("time");
                spanEl.innerHTML = formatAMPM(weatherForecastArray[i]["from"]);

                iconEl = timeNodes[i].appendChild(document.createElement("span"));
                iconEl.classList.add("weatherTimeIcons");
                const imgUrl = "http://openweathermap.org/img/wn/" + weatherForecastArray[i]["icon"] + ".png";
                iconEl.innerHTML = "<img src=" + imgUrl +">";

                spanEl = timeNodes[i].appendChild(document.createElement("span"));
                spanEl.classList.add("temp-forecast");
                spanEl.innerHTML = weatherForecastArray[i]["temp"] + "<sup style='font-size: 10px;'>" + unitSymbol + "</sup>";
            }
        }
    }   
    forecast_weather_request.open("GET",  forecast_url, true);
    forecast_weather_request.send();

}

function getSecondCityWeather(location) {


    if(document.getElementById('cityRightLocation').value == ''){
        alert("Please Enter Valid Location!");
        return;
    }
    if(document.getElementById('cityLeftLocation').value == location){
        alert("Same Location Entered! Try Again!");
        return;
    }

    const unit = document.getElementById('switcher-2').checked ? 'metric' : 'imperial';
    const unitSymbol = document.getElementById('switcher-2').checked ? '&#8451;' : '&#8457;';

    const current_url = "https://api.openweathermap.org/data/2.5/weather?q=" + location +"&appid="+ api_key +"&mode=xml&units=" + unit;

    const current_weather_request = new XMLHttpRequest();
    current_weather_request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const weatherData = this.responseXML;

            const city = weatherData.getElementsByTagName("current")[0].childNodes[0].getAttribute("name");
            currentWeatherArray["city"] = city;
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

            const currentDate = new Date();
            document.querySelector("#secondCityDay1 .today").textContent = "Today";
            document.querySelector("#secondCityDay1 .today-date").textContent = days[currentDate.getDay()] + ", " + currentDate.getDate() + " " + months[currentDate.getMonth()];
            document.querySelector("#secondCityDay1 #current-date-wrapper #icon-div #weatherImg").src = getTempIcon[currentWeatherArray.icon];
            document.querySelector("#secondCityDay1 .temp-main").innerHTML = currentWeatherArray["temp"] + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
            document.querySelector("#secondCityDay1 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];

            const sunriseTime = new Date(currentWeatherArray["sunrise"]);
            const sunsetTime = new Date(currentWeatherArray["sunset"]);

            document.querySelector("#secondCityDay1 .sunrise").textContent = "Sunrise " + sunriseTime.getHours() + ":" + sunriseTime.getMinutes();
            document.querySelector(" #secondCityDay1 .sunset").textContent = "Sunset " + sunsetTime.getHours() + ":" + sunsetTime.getMinutes();

        }
    };
    current_weather_request.open("GET", current_url, true);
    current_weather_request.send();


    // Forecast City 2
    const forecast_url = "https://api.openweathermap.org/data/2.5/forecast?q="+ location +"&mode=xml&appid="+ api_key +"&units=" + unit;

    const forecast_weather_request = new XMLHttpRequest();
    forecast_weather_request.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            const forecastData = this.responseXML;

            const weatherForecast = forecastData.getElementsByTagName("weatherdata")[0].childNodes[4].childNodes;

            const weatherForecastArray = {};
            
            for(let i=0; i<weatherForecast.length; i++) {
                weatherForecastArray[i] = {};
                weatherForecastArray[i]["from"] = new Date(weatherForecast[i].getAttribute("from"));
                weatherForecastArray[i]["to"] = new Date(weatherForecast[i].getAttribute("to"));
                weatherForecastArray[i]["weather_title"] = weatherForecast[i].childNodes[0].getAttribute("name");
                weatherForecastArray[i]["icon"] = weatherForecast[i].childNodes[0].getAttribute("var");
                weatherForecastArray[i]["weather_title"] = weatherForecast[i].childNodes[0].getAttribute("name");
                weatherForecastArray[i]["wind_speed"] = weatherForecast[i].childNodes[3].getAttribute("mps") + "m/s";
                weatherForecastArray[i]["temp"] = Math.round(weatherForecast[i].childNodes[4].getAttribute("value") * 10) / 10;
                weatherForecastArray[i]["max_temp"] = weatherForecast[i].childNodes[4].getAttribute("max");
                weatherForecastArray[i]["min_temp"] = weatherForecast[i].childNodes[4].getAttribute("min");
            }

            for(i=1; i<=dateArray.length; i++) {
                const dayElement = "#secondCityDay" + i + " > .time_pred";
                const dayArea = document.querySelector(dayElement);
                while(dayArea.hasChildNodes()){
                    dayArea.removeChild(dayArea.lastChild);
                }
            }   
 
            let temp_main_day3 = 0; let day3_count = 0;
            let temp_main_day4 = 0; let day4_count = 0;
            let temp_main_day2 = 0; let day2_count = 0;
            let temp_main_day5 = 0; let day5_count = 0;
            let temp_main_day6 = 0; let day6_count = 0;
            

            for(let i=0; i<=39; i++) {
                if (weatherForecastArray[i]["from"].getDate() == dateArray[0]) {
                    document.querySelector("#secondCityDay1 > .time_pred").appendChild(document.createElement("div"));
                    const timeDivs = document.querySelector("#secondCityDay1 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                    timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[1]) {
                    day2_count+=1;
                    temp_main_day2 += weatherForecastArray[i].temp;
                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#secondCityDay2 #tomorrow-date-wrapper #tomorrow-date-details .day-name").textContent = "Tomorrow";
                    document.querySelector("#secondCityDay2 #tomorrow-date-wrapper #tomorrow-date-details .date").textContent = days[dt.getDay()] + ", " + dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#secondCityDay2 .temp-forecast-main").innerHTML = parseInt(temp_main_day2 / day2_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#secondCityDay2 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    // console.log(getTempIcon[weatherForecastArray[i]["icon"]]);
                    document.querySelector("#secondCityDay2 #tomorrow-date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i].icon];
                    
                    document.querySelector("#secondCityDay2 > .time_pred").appendChild(document.createElement("div"));
                    const timeDivs = document.querySelector("#secondCityDay2 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }
                

                if (weatherForecastArray[i]["from"].getDate() == dateArray[2]) {
                    day3_count+=1;
                    temp_main_day3 += weatherForecastArray[i].temp;
                    // iconsArray3.push(weatherForecastArray[i]["icon"]);

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#secondCityDay3 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#secondCityDay3 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#secondCityDay3 .temp-forecast-main").innerHTML = parseInt(temp_main_day3 / day3_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#secondCityDay3 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#secondCityDay3 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#secondCityDay3 > .time_pred").appendChild(document.createElement("div"));
                    const timeDivs = document.querySelector("#secondCityDay3 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[3]) {
                    day4_count+=1;
                    temp_main_day4 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#secondCityDay4 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#secondCityDay4 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#secondCityDay4 .temp-forecast-main").innerHTML = parseInt(temp_main_day4 / day4_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#secondCityDay4 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#secondCityDay4 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#secondCityDay4 > .time_pred").appendChild(document.createElement("div"));
                    const timeDivs = document.querySelector("#secondCityDay4 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[4]) {
                    day5_count+=1;
                    temp_main_day5 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#secondCityDay5 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#secondCityDay5 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#secondCityDay5 .temp-forecast-main").innerHTML = parseInt(temp_main_day5 / day5_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#secondCityDay5 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#secondCityDay5 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#secondCityDay5 > .time_pred").appendChild(document.createElement("div"));
                    const timeDivs = document.querySelector("#secondCityDay5 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

                if (weatherForecastArray[i]["from"].getDate() == dateArray[5]) {
                    day6_count+=1;
                    temp_main_day6 += weatherForecastArray[i].temp;

                    const dt = new Date(weatherForecastArray[i]["from"]);
                    document.querySelector("#secondCityDay6 #date-wrapper #date-details .day-name").textContent = days[dt.getDay()] + "";
                    document.querySelector("#secondCityDay6 #date-wrapper #date-details .date").textContent = dt.getDate() + " " + months[dt.getMonth()];
                    document.querySelector("#secondCityDay6 .temp-forecast-main").innerHTML = parseInt(temp_main_day6 / day6_count) + "<sup style='font-size: 20px;'>" + unitSymbol + "</sup>";
                    document.querySelector("#secondCityDay6 .address").textContent = currentWeatherArray["city"] + ", " + currentWeatherArray["country"];
                    document.querySelector("#secondCityDay6 #date-wrapper #icon-div #weatherImg").src = getTempIcon[weatherForecastArray[i]["icon"]];

                    document.querySelector("#secondCityDay6 > .time_pred").appendChild(document.createElement("div"));
                    const timeDivs = document.querySelector("#secondCityDay6 > .time_pred").childNodes;
                    for(let j=0; j<timeDivs.length; j++) {
                        timeDivs[j].classList.add("timelyWeatherWrapper");
                    }
                }

            }
            // End of For Loop

            const timeNodes = document.querySelectorAll("#compareCity2 .timelyWeatherWrapper");
            for(let i=0; i<=39; i++) {
                spanEl = timeNodes[i].appendChild(document.createElement("span"));
                spanEl.classList.add("time");
                spanEl.innerHTML = formatAMPM(weatherForecastArray[i]["from"]);

                iconEl = timeNodes[i].appendChild(document.createElement("span"));
                iconEl.classList.add("weatherTimeIcons");
                const imgUrl = "http://openweathermap.org/img/wn/" + weatherForecastArray[i]["icon"] + ".png";
                iconEl.innerHTML = "<img src=" + imgUrl +">";

                spanEl = timeNodes[i].appendChild(document.createElement("span"));
                spanEl.classList.add("temp-forecast");
                spanEl.innerHTML = weatherForecastArray[i]["temp"] + "<sup style='font-size: 10px;'>" + unitSymbol + "</sup>";
            }
        }
    }   
    forecast_weather_request.open("GET",  forecast_url, true);
    forecast_weather_request.send();
}