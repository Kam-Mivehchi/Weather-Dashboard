const API_KEY = "35d94501369d43748d1a83d5811f76e7"
const searchInput = document.getElementById("search")
const currentWeatherCard = document.getElementById("currentWeather")
const forecastCard = document.getElementById("forecast")
const Utils = {
    //creates html elements
    generateHTMLElement(element, classes, text) {
        const newEl = document.createElement(element);
        classes.split(" ").forEach(className => newEl.classList.add(className));
        newEl.textContent = text;
        return newEl;
    },
    //generates a url string based on desire parameters
    generateUrl(endpoint, city_name, units = "imperial") {
        // endpoint =[weather,forecast,air_pollution]
        return `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city_name}&units=${units}&appid=${API_KEY}`
    },
    setLocalStorage(key, value) {
        try {
            if (key === "units") {
                localStorage.setItem(key, JSON.stringify(value))
                return;
            }

            const prev = this.getLocalStorage(key);

            if (value in prev) {
                return;
            }

            prev[value] = true
            localStorage.setItem(key, JSON.stringify(prev));
        } catch (error) {
            console.error('Error storing item in localStorage:', error);
        }
    },

    getLocalStorage(key) {
        try {
            const value = localStorage.getItem(key);

            return value ? JSON.parse(value) : {};
        } catch (error) {
            console.error('Error retrieving item from localStorage:', error);
            return null;
        }
    },

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from localStorage:', error);
        }
    }
}

init()
document.getElementById("search-form").addEventListener("submit", handleSearch);


function init() {

    fetchCurrentWeather("Anaheim")
    fetchForecast("Anaheim")
    generateRecentCities()
}


function handleSearch(e) {
    e.preventDefault();

    //fetches data from openweather then generate weather cards
    fetchCurrentWeather(e.target[0].value.trim())
    fetchForecast(e.target[0].value.trim())

    //reset the input
    searchInput.value = ""
}

//get current weather data and calls function to create each card
async function fetchCurrentWeather(city) {
    const response = await fetch(Utils.generateUrl("weather", city));

    const jsonData = await response.json();

    if (!response.ok) {
        console.error(jsonData)
    }
    //destructure response
    const { coord, dt: last_updated, main: currentConditions, name, sys: sun_data, weather, wind } = jsonData

    //save the city to local storage
    Utils.setLocalStorage("recents", name);
    generateRecentCities()


    //create current weather card with current and details
    generateCurrentWeatherCard(name, weather, currentConditions, last_updated)
    generateCurrentWindCard(wind)
    generateCurrentSunCard(sun_data)
    generateCurrentDetailsCard(currentConditions)

    renderBackground(weather[0].id)

}
function renderBackground(id) {


    console.log(id)
    switch (true) {
        //Thunderstorm
        case (id < 300):
            lighteningEffect()
            break;
        // Drizzle
        case (id < 400):
            break;
        //Rain
        case (id < 600):
            rainingCanvas()
            break;
        //Snow
        case (id < 700):
            break;
        //atmosphere (ie smog/smoke)
        case (id < 800):
            console.log("Ir an")

            break;
        // clear skys
        case (id === 800):

            break;
        //Clouds
        default:
            break;

    }


}

async function fetchForecast(city) {
    const response = await fetch(Utils.generateUrl("forecast", city));

    const jsonData = await response.json();

    if (!response.ok) {
        console.error(jsonData)
    }

    //descructure response
    const { list } = jsonData;

    generateForecastCard(list)

}
//loop through each forecast data set and construct the day cards
function generateForecastCard(list) {
    let htmlString = ''
    list.forEach((timeblock, idx) => {
        const { dt_txt, weather, main } = timeblock;

        // every new day I want to create a new section for that day
        if (dt_txt.split(' ')[1] == "00:00:00" || idx == 0) {
            htmlString += `<li class=" d-flex flex-column align-items-center col-12 col-md-6 col-lg-4 ">
                        <h4>${dayjs(dt_txt).format('ddd')}</h4>
                        <ul class="list-group">
                        `
        }

        //  create list items and add it html string
        htmlString += `<li
                                class="row p-0 border-end-0 border-start-0 border-top d-flex justify-content-center text-lead align-items-center w-100">
                                <small class="col-3  ">${dayjs(dt_txt).format('ha')}</small>
                                <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" class="col-2" />
                                <div class=" d-flex  col-6 justify-content-between align-items-center gap-1 ">
                                    <p class=" m-0 cold">${Math.floor(main.temp_min)}°</p>
                                    <div class="bg-dark w-100 m-0 p-0 rounded-pill gradient " style="height:3px;">
                                    </div>
                                    <p class=" m-0 hot">${Math.floor(main.temp_max)}°</p>
                                </div>
                            </li>`

        //on the last item on the day close the list group
        if (dt_txt.split(' ')[1] == "21:00:00") {
            htmlString += "</ul></li >"
        }
    })
    //add the forecast string to the dom
    document.getElementById("forecast").getElementsByTagName('ul')[0].innerHTML = htmlString
}

function generateCurrentWeatherCard(name, weather, currentConditions, last_updated) {

    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

    //generate current weather card
    document.getElementById("currentDay").getElementsByTagName('p')[0].textContent = dayjs().format("dddd")
    document.getElementById("currentDay").getElementsByTagName('p')[1].textContent = dayjs().format("MMMM D, YYYY")
    document.getElementById("icon").src = iconUrl;

    document.getElementById("lastUpdate").getElementsByTagName('small')[1].textContent = dayjs.unix(last_updated).format("h:mm a")
    currentWeatherCard.getElementsByTagName('h5')[0].textContent = name
    currentWeatherCard.getElementsByTagName('h1')[0].textContent = `${Math.floor(currentConditions.temp)}°`
    currentWeatherCard.getElementsByTagName('p')[0].textContent = `${weather[0].description}`
    currentWeatherCard.getElementsByTagName('div')[0].innerHTML = ""
    currentWeatherCard.getElementsByTagName('div')[0].appendChild(Utils.generateHTMLElement("p", "lead m-0", `H: ${Math.floor(currentConditions.temp_max)}°`))
    currentWeatherCard.getElementsByTagName('div')[0].appendChild(Utils.generateHTMLElement("p", "lead m-0", `L: ${Math.floor(currentConditions.temp_min)}°`))
}

function generateCurrentWindCard(wind) {
    //generate wind card
    document.getElementById("compass").getElementsByTagName('p')[0].textContent = `${wind.speed}`
    const root = document.querySelector(':root');

    // set css variable for arrow direction
    root.style.setProperty('--arrow-direction', `${wind.deg}deg`);
}

function generateCurrentDetailsCard(currentConditions) {
    //generate details card
    const currentDetails = document.getElementById("currentDetails")
    currentDetails.getElementsByTagName('p')[0].textContent = `Feels Like: ${Math.floor(currentConditions.feels_like)}°`
    currentDetails.getElementsByTagName('p')[1].textContent = `Humidity: ${currentConditions.humidity}`
    currentDetails.getElementsByTagName('p')[2].textContent = `Pressure: ${parseFloat(currentConditions.pressure * 0.02953).toFixed(2)} inHg`
}

//generate sunrise + sunset card
function generateCurrentSunCard(sun_data) {
    const sunElements = document.getElementById("sun")
    sunElements.getElementsByTagName('p')[0].textContent = `Sunrise: ${dayjs.unix(sun_data.sunrise).format("h:mm a")}`
    sunElements.getElementsByTagName('p')[1].textContent = `Sunset: ${dayjs.unix(sun_data.sunset).format("h:mm a")}`
}

//generate buttons for recent cities section
function generateRecentCities() {
    const recentsElement = document.getElementById("recents")
    recentsElement.innerHTML = ""
    //loop through each ls item,create a button for it and append to the recent container
    for (const city in Utils.getLocalStorage("recents")) {
        const wrapper = Utils.generateHTMLElement("div", "wrapper", "")

        const button = Utils.generateHTMLElement("button", "recentCity btn btn-sm btn-primary rounded-pill me-1 mb-1", city)
        button.setAttribute("style", "width: max-content")
        button.setAttribute("onclick", "width: max-content")
        button.addEventListener("click", (e) => {

            fetchCurrentWeather(e.target.textContent);
            fetchForecast(e.target.textContent)
        })
        wrapper.appendChild(button);
        recentsElement.appendChild(wrapper)
    }
}





// var canvas = $('#canvas')[0];
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// function rainingCanvas() {


//     if (canvas.getContext) {
//         var ctx = canvas.getContext('2d');
//         var w = canvas.width;
//         var h = canvas.height;
//         ctx.strokeStyle = 'rgba(174,194,224,0.8)';
//         ctx.lineWidth = 1;
//         ctx.lineCap = 'round';


//         var init = [];
//         var maxParts = 1000;
//         for (var a = 0; a < maxParts; a++) {
//             init.push({
//                 x: Math.random() * w,
//                 y: Math.random() * h,
//                 l: Math.random() * 1,
//                 xs: -4 + Math.random() * 4 + 2,
//                 ys: Math.random() * 10 + 10
//             })
//         }

//         var particles = [];
//         for (var b = 0; b < maxParts; b++) {
//             particles[b] = init[b];
//         }

//         function draw() {
//             ctx.clearRect(0, 0, w, h);
//             for (var c = 0; c < particles.length; c++) {
//                 var p = particles[c];
//                 ctx.beginPath();
//                 ctx.moveTo(p.x, p.y);
//                 ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
//                 ctx.stroke();
//             }
//             move();
//         }

//         function move() {
//             for (var b = 0; b < particles.length; b++) {
//                 var p = particles[b];
//                 p.x += p.xs;
//                 p.y += p.ys;
//                 if (p.x > w || p.y > h) {
//                     p.x = Math.random() * w;
//                     p.y = -20;
//                 }
//             }
//         }

//         setInterval(draw, 30);

//     }

// }



// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// var ctx = canvas.getContext("2d");

// var center = { x: window.innerWidth / 2, y: 20 };
// var minSegmentHeight = 5;
// var groundHeight = window.innerWidth - 20;
// var color = "hsl(180, 80%, 80%)";
// var roughness = 2;
// var maxDifference = window.innerWidth / 5;

// ctx.globalCompositeOperation = "lighter";

// ctx.strokeStyle = color;
// ctx.shadowColor = color;

// ctx.fillStyle = color;
// ctx.fillRect(0, 0, window.innerWidth, window.innerWidth);
// ctx.fillStyle = "hsla(0, 0%, 10%, 0.2)";

// function renderLightening() {
//     ctx.shadowBlur = 0;
//     ctx.globalCompositeOperation = "source-over";
//     ctx.fillRect(0, 0, window.innerWidth, window.innerWidth);
//     ctx.globalCompositeOperation = "lighter";
//     ctx.shadowBlur = 15;
//     var lightning = createLightning();
//     ctx.beginPath();
//     for (var i = 0; i < lightning.length; i++) {
//         ctx.lineTo(lightning[i].x, lightning[i].y);
//     }
//     ctx.stroke();
//     requestAnimationFrame(render);
// }

// function createLightning() {
//     var segmentHeight = groundHeight - center.y;
//     var lightning = [];
//     lightning.push({ x: center.x, y: center.y });
//     lightning.push({ x: Math.random() * (window.innerWidth - 100) + 50, y: groundHeight + (Math.random() - 0.9) * 50 });
//     var currDiff = maxDifference;
//     while (segmentHeight > minSegmentHeight) {
//         var newSegments = [];
//         for (var i = 0; i < lightning.length - 1; i++) {
//             var start = lightning[i];
//             var end = lightning[i + 1];
//             var midX = (start.x + end.x) / 2;
//             var newX = midX + (Math.random() * 2 - 1) * currDiff;
//             newSegments.push(start, { x: newX, y: (start.y + end.y) / 2 });
//         }

//         newSegments.push(lightning.pop());
//         lightning = newSegments;

//         currDiff /= roughness;
//         segmentHeight /= 2;
//     }
//     return lightning;
// }
// renderLightening()