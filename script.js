//field variables
var current = $('#current');
var city = $('#City');
var icon =$('#icon');
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var uv = $('#uv');
var sunrise =$('#sunrise');
var sunset =$('#sunset');
var fiveDay =$('#fiveDay');
var search = $('#searchBtn');
let inputEl = $('#userInput');
var longitude ='';
var latitude =''

//event listner for user input, initates the function load stage which updates the current stage with users weather info from user selection or input
search.on('click' ,loadStage);

//function that takes the users input or selection then fetches weather info through getCurrentWeather function
function loadStage() {
    
   var city_name = inputEl.val();
    
   //
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    console.log(weatherURL);
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
             
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
}; 
        
   

        
        
        
        
//function to populate the main stage data     
function getCurrentWeather(){
    urlWeather ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude +"&lon=" + longitude + "&units=imperial&appid=35d94501369d43748d1a83d5811f76e7";
            
            console.log(urlWeather);
    fetch(urlWeather)
    //converts json into string
    .then(response => response.json())
    .then(data => {
        //console log object to determine how to reference object items
        console.log(data);
        //update current weather indormation to reflect the users choice
        temp.text(`Current Temperature: ${data.current.temp}\xB0F`);
        wind.text(`Wind: ${data.current.wind_speed} MPH ${data.current.wind_deg}`);
        humidity.text(`Humidity: ${data.current.humidity}%`);
        uv.text(`UV Index: ${data.current.uvi}`);
        sunrise.text(`Sunrise: ${getTime(data.current.sunrise)}AM  `);
        sunset.text(`Sunset: ${getTime(data.current.sunset)}PM`);

       fiveDay.empty();
        //update the 5 day forecast dynamically
        //iterate through the objext array 5 times and display cards
        console.log(data.daily)
        var dailyArray =data.daily
        for (var i =0; i<5;i++){
            //assigns variable for the icon url
            var iconCode=dailyArray[i].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetches icon dynamically
            fetch(iconurl)
            .then(data => {
                $('#fiveDayIcon').attr('src', data.url);

            });
            //function call to create a card for each of the next 5 days using api data
            createCard(getDate(dailyArray[i].dt),iconurl, dailyArray[i].temp.max, dailyArray[i].temp.min,
                  dailyArray[i].wind_speed,dailyArray[i].wind_deg, dailyArray[i].humidity, getTime(dailyArray[i].sunrise),getTime(dailyArray[i].sunset));

                }
        
               
        });
};
//function to populate fields based on preset values
console.log($('#presets').children().contents());
//function to render cards for the 5 day forecast
function createCard (date,icon,tempH,tempL,windSpeed,windDir,humidity,sunrise,sunset){
    
    fiveDay.append(`<div class="card d-inline-flex mx-3" style="width: 13rem;border-radius: 20px;background-color:black;">
    <div class="card-body text-center" id='fiverCards'>
    <h5 class="card-title" id='card-title'>${date}</h5>
    <img id ='fiveDayIcon'src=${icon}>
    <h6 class="card-subtitle mb-2 text-muted" id ='temps'>H:${tempH}\xB0F</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='temps'>L:${tempL}\xB0F</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Wind:${windSpeed} MPH ${windDir}</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Humidity:${humidity}%</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Sunrise: ${sunrise} AM</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Sunset: ${sunset}PM</h6>
    
    
    </div>
    </div>`);
};

function getTime(unix_time){
    var date = new Date(unix_time*1000);
    var hours = date.getHours();
    if(hours>12){
        hours-=12;
    }
    var minutes = date.getMinutes()
    
    if(minutes<10){
        minutes ='0'+minutes;
        
    }
    return `${hours}:${minutes}`;
};

function getDate(unix_time){
    var date = new Date(unix_time*1000);
    var month =date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    return`${month}/${day}/${year}`;
}


$('#Austin').on('click',()=>{
    var city_name = 'Austin';
    
   //
    weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#Chicago').on('click', ()=>{
    var city_name = 'Chicago';
    
   //
    weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#New').on('click', ()=>{
    var city_name = 'new york';
    
   //
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lat;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#Orlando').on('click', ()=>{
    var city_name = 'Orlando';
    
   //
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#San').on('click', ()=>{
    var city_name = 'san francisco';
    
   //
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#Seatle').on('click', ()=>{
    var city_name = 'Seattle';
    
   //
    weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#Denver').on('click', ()=>{
    var city_name = 'Denver';
    
   //
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
$('#Atlanta').on('click', ()=>{
    var city_name = 'Atlanta';
    
   //
    weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
        
        
    
        
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
            //fetches api and assigns variable to long and latitiude to use in the full open weather API
            longitude = data.coord.lon;
            latitude = data.coord.lat;
            //convert weather icon into URL string
            var iconCode=data.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            //fetch and updating the icon
            fetch(iconurl)
            .then(data => {
                icon.attr('src', data.url)

            });
            city.text(`${data.name} ${getDate(data.dt)}`);
            
             
            getCurrentWeather();
        });
});
