
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchInput=document.querySelector("[data-searchInput]");


let currentTab=userTab;
let API_key = "60e9cd966923d40a6a5e8f40dd2cf6a0";
currentTab.classList.add('current-tab');
getfromSessionStorage();



function switchTab(clickedTab){
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active'))
        {
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}
//add event listner when user clicks on any tab
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

//Session Storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//fectch user info
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');
    
    try{
        const result= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
          );
        const data=await result.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove('active');

        // console.log(e)
    }
}
//error handle
function handleError(){
    userInfoContainer.setAttribute('background-image','https://imgs.search.brave.com/AGxhohxx7OB-qacvra1J3pmoHC5QcU4h9gYNH_DFu_Q/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9vcmRl/cnMuZml0Y2hlZi5j/by56YS9hc3NldHMv/aW1nLzQwNC1lcnJv/ci1wYWdlLW5vdC1m/b3VuZC5qcGc')
}

//render info
function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    if(`${weatherInfo?.main?.temp}`===undefined){
        handleError();
    }
    else{
        
        temp.innerText = `${weatherInfo?.main?.temp} ℃`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity} %`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
        
    }
}

//grant access of location
function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{

    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)
}

grantAccessButton.addEventListener('click',getLocation);

//search form submit
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

// city weather info

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
          );
        const data=await response.json();
        console.log(data);
        if(data?.message==='city not found')
            throw new Error(response.message);
        loadingScreen.classList.remove('active');
        eroorContainer.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(e){
        
        loadingScreen.classList.remove('active');
        eroorContainer.classList.add('active');
    }
}
