const api_key = "143de8ba913c997cadf64d3d59f13c63";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const currentWeatherArray = {};
const weatherForecastArray = {};
const orderArray = [1, 2, 3, 4, 5, 6];

function formatAMPM(date) {
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    var strTime = hours + ' ' + ampm;
    return strTime;
}

const getTempIcon = {
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

const day1 = new Date();
const day2 = new Date(); day2.setDate(day1.getDate() + 1);
const day3 = new Date(); day3.setDate(day2.getDate() + 1);
const day4 = new Date(); day4.setDate(day3.getDate() + 1);
const day5 = new Date(); day5.setDate(day4.getDate() + 1);
const day6 = new Date(); day6.setDate(day5.getDate() + 1);
const dateArray = [day1.getDate(), day2.getDate(), day3.getDate(), day4.getDate(), day5.getDate(), day6.getDate()];
const dayArray = [day1.getDay(), day2.getDay(), day3.getDay(), day4.getDay(), day5.getDay(), day6.getDay()];


const options = document.getElementsByTagName("option");
console.log(options[0]);

for(let i = 3; i <= options.length; i++) {
    const selectedDay = dayArray[i-1];
    console.log(fullDays[selectedDay]);
    options[i-1].value = fullDays[selectedDay];
    options[i-1].textContent = fullDays[selectedDay];
}