const API_KEY = "35d94501369d43748d1a83d5811f76e7"
const searchInput = document.getElementById("search")
const currentWeatherCard = document.getElementById("currentWeather")
const forecastCard = document.getElementById("forecast")
const LocalStorageUtil = {
    setItem(key, value) {
        try {
            if (key === "units") {
                localStorage.setItem(key, JSON.stringify(value))
                return;
            }

            const prev = this.getItem(key);

            if (value in prev) {
                return;
            }

            prev[value] = true
            localStorage.setItem(key, JSON.stringify(prev));
        } catch (error) {
            console.error('Error storing item in localStorage:', error);
        }
    },

    getItem(key) {
        try {
            const value = localStorage.getItem(key);

            return value ? JSON.parse(value) : {};
        } catch (error) {
            console.error('Error retrieving item from localStorage:', error);
            return null;
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from localStorage:', error);
        }
    }
};

init()


document.getElementById("search-form").addEventListener("submit", handleSearch);

function handleSearch(e) {
    e.preventDefault();
    // console.dir(e.target[1].checked)


    //fetches data from openweather then generate current weather card
    fetchCurrentWeather(e.target[0].value.trim())
    fetchForecast(e.target[0].value.trim())
    //reset the input
    searchInput.value = ""
}



//creates a url for a specific city and api endpoint
function generateUrl(endpoint, city_name, units = "imperial") {
    // endpoint =[weather,forecast,air_pollution]
    return `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city_name}&units=${units}&appid=${API_KEY}`
}
//adapts to different open weather api endpoints
async function fetchCurrentWeather(city) {
    const response = await fetch(generateUrl("weather", city));

    const jsonData = await response.json();

    if (!response.ok) {
        console.error(jsonData)
    }
    //descructure response
    const { coord, dt: last_updated, main: currentConditions, name, sys: sun_data, weather, wind } = jsonData

    //save the city to local storage
    LocalStorageUtil.setItem("recents", name)

    // console.log(coord, last_updated, currentConditions, name, sun_data, weather, wind);

    //create current weather card with current and details
    generateCard(name, weather, currentConditions, sun_data, wind, last_updated)


}
async function fetchForecast(city) {
    const response = await fetch(generateUrl("forecast", city));

    const jsonData = await response.json();
    console.log(jsonData)
    if (!response.ok) {
        console.error(jsonData)
    }
    //descructure response
    const { list } = jsonData;
    console.log(list)

    let htmlString = ''
    list.forEach((timeblock, idx) => {
        const { dt_txt, weather, main } = timeblock;
        console.log({ dt_txt, weather, main })
        // every new day I want to create a new accordian item and accordian collapse group

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

        //



    })
    // console.log(htmlString)
    document.getElementById("forecast").getElementsByTagName('ul')[0].innerHTML = htmlString
    //update the inner html of #accordian with the string

    // console.log(coord, last_updated, currentConditions, name, sun_data, weather, wind);

    //create current weather card with current and details

}
// render previosly search cities from localStorage
function init() {

    fetchCurrentWeather("Anaheim")
    fetchForecast("Anaheim")
    generateRecents()
}
// getCurrentWeather()


function generateCard(name, weather, currentConditions, sun_data, wind, last_updated) {
    // console.log({ name, weather, currentConditions, sun_data, wind, last_updated })

    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    // console.log(iconUrl)
    //generate current weather card
    document.getElementById("currentDay").getElementsByTagName('p')[0].textContent = dayjs().format("dddd")
    document.getElementById("currentDay").getElementsByTagName('p')[1].textContent = dayjs().format("MMMM D, YYYY")
    document.getElementById("icon").src = iconUrl;
    // console.dir(currentWeatherCard.getElementsByTagName('img'))
    document.getElementById("lastUpdate").getElementsByTagName('small')[1].textContent = dayjs.unix(last_updated).format("h:mm a")
    currentWeatherCard.getElementsByTagName('h5')[0].textContent = name
    currentWeatherCard.getElementsByTagName('h1')[0].textContent = `${Math.floor(currentConditions.temp)}°`
    currentWeatherCard.getElementsByTagName('p')[0].textContent = `${weather[0].description}`
    currentWeatherCard.getElementsByTagName('div')[0].innerHTML = ""
    currentWeatherCard.getElementsByTagName('div')[0].appendChild(generateHTMLElement("p", "lead m-0", `H: ${Math.floor(currentConditions.temp_max)}°`))
    currentWeatherCard.getElementsByTagName('div')[0].appendChild(generateHTMLElement("p", "lead m-0", `L: ${Math.floor(currentConditions.temp_min)}°`))

    //generate sunrise + sunset card
    const sunElements = document.getElementById("sun")
    sunElements.getElementsByTagName('p')[0].textContent = `Sunrise: ${dayjs.unix(sun_data.sunrise).format("h:mm a")}`
    sunElements.getElementsByTagName('p')[1].textContent = `Sunset: ${dayjs.unix(sun_data.sunset).format("h:mm a")}`


    //generate details card
    const currentDetails = document.getElementById("currentDetails")
    currentDetails.getElementsByTagName('p')[0].textContent = `Feels Like: ${Math.floor(currentConditions.feels_like)}°`
    currentDetails.getElementsByTagName('p')[1].textContent = `Humidity: ${currentConditions.humidity}`
    currentDetails.getElementsByTagName('p')[2].textContent = `Pressure: ${parseFloat(currentConditions.pressure * 0.02953).toFixed(2)} inHg`


    //generate wind card
    document.getElementById("compass").getElementsByTagName('p')[0].textContent = `${wind.speed}`
    const root = document.querySelector(':root');

    // set css variable
    root.style.setProperty('--arrow-direction', `${wind.deg}deg`);

}

//enter classes as a space seperated list
function generateHTMLElement(element, classes, text) {
    const newEl = document.createElement(element);
    classes.split(" ").forEach(className => newEl.classList.add(className));
    newEl.textContent = text;
    return newEl;
}

function generateRecents() {
    const recentsElement = document.getElementById("recents")

    recentsElement.innerHTML = ""
    for (const city in LocalStorageUtil.getItem("recents")) {
        const wrapper = generateHTMLElement("div", "wrapper", "")
        console.log(city)
        const button = generateHTMLElement("button", "recentCity btn btn-sm btn-primary rounded-pill me-1 mb-1", city)
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

