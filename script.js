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


}
async function fetchForecast(city) {
    const response = await fetch(Utils.generateUrl("forecast", city));

    const jsonData = await response.json();

    if (!response.ok) {
        console.error(jsonData)
    }

    //descructure response
    const { list } = jsonData;


    let htmlString = ''
    list.forEach((timeblock, idx) => {
        const { dt_txt, weather, main } = timeblock;

        // every new day I want to create a new section for that day
        if (dt_txt.split(' ')[1] == "00:00:00" || idx == 0) {
            htmlString += `<li class="list-group-item d-flex justify-content-between">
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





