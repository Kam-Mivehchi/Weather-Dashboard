const API_KEY = "35d94501369d43748d1a83d5811f76e7"

const searchInput = document.getElementById("search")


function handleSearch(e){
    e.preventDefault();
    console.dir(e.target[0].value.trim())

    //add to local storage

    fetchCurrentWeather(e.target[0].value.trim()) 

    //reset the input
    searchInput.value=""
}


document.getElementById("search-form").addEventListener("submit",handleSearch);



//creates a url for a specific city and api endpoint
 function generateUrl( endpoint, city_name ){
// endpoint =[weather,forecast,air_pollution]
    return `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city_name}&units=imperial&appid=${API_KEY}`
}
//adapts to different open weather api endpoints
async function fetchCurrentWeather (city) {
    const response = await fetch(generateUrl("weather", city));

    const jsonData = await response.json();
    console.log(jsonData)
    if(!response.ok){
        console.error(jsonData)
    }

    const {coord, dt:last_updated,main:current,name, sys:sun_data, weather, wind}=jsonData

    //save the city to local storage
    LocalStorageUtil.setItem("recents",name)

    console.log(coord, last_updated, current, name, sun_data, weather, wind);
    //create current weather card with current and details

   
    
}
// render previosly search cities from localStorage
function init(){

}
// getCurrentWeather()
const LocalStorageUtil = {
    setItem(key,value) {
        try {
            const prev= this.getItem(key);

            if(value in prev){
                return;
            }

            prev[value]=true
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


