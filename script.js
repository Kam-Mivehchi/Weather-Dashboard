const API_KEY = "35d94501369d43748d1a83d5811f76e7"






    

//creates a url for a specific city and api endpoint
 function createUrl(city_name, endpoint ){
// endpoint =[weather,forecast,air_pollution]
    return `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city_name}&units=imperial&appid=${API_KEY}`
}

async function getCurrentWeather () {
    const response = await fetch(createUrl("anaheim","weather"));
    const jsonData = await response.json();
    if(!response.ok){
        console.error(jsonData)
    }
    const {coord, dt:last_updated,main:current,name, sys:sun_data, weather:details, wind}=jsonData
   
    console.log(coord,  last_updated, current, name,  sun_data,  details, wind);
    
}


// getCurrentWeather()

const LocalStorageUtil = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error storing item in localStorage:', error);
        }
    },

    getItem(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
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