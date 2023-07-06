const userTab = document.querySelector('[data-userWeather]');
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer =document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput=document.querySelector("[data-searchInput]");
let currentTab= userTab;
const API_key="61f61e9ea47eeedebd2af8f5870e5f7b";
currentTab.classList.add("current-tab");
getFromStorage();

// All Functions 

function switchTab(clickedTab){
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active");
        }
        else{
            //search tab pe tha ab dusre tab pe jana hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //checking locacal storge for co-ordinate if any is saved;
            getFromStorage();

        }
    }
}
//checks for cordinate //
function getFromStorage(){
    const localCoordinate =  sessionStorage.getItem("user-coordinates");
    if(!localCoordinate)
    {
        //cordinates nhi mile //
        //grant location wali window dena padega re baba//
        grantAccessContainer.classList.add("active");

    }
    else{
        //agar cordinates pade hai //
        const coordinates = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    console.log(coordinates);
    const {lat,lon}=coordinates;
    // make grant container invisible//
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        console.log("Api fetch failed");
    }
}
function renderWeatherInfo(data){
    //element fetching //
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryFlag]");
    const desc = document.querySelector("[data-WeatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temperature]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity  = document.querySelector("[data-humidity]");
    const cloudiness  = document.querySelector("[data-cloudiness]");
    // 1:16:00
    //fetch values from weather info //
    cityName.innerText=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} \xB0C`;
    //temp.innerText=temp.innerText+' \xB0'+'C';
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText =`${data?.main?.humidity}%` ;
    cloudiness.innerText = `${data?.clouds?.all}%`;
    //console.log(cloudiness.innerText);

    
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geoPosition support");
    }
}
function showPosition(position)
{
    const userCoordinates ={
        lat:position.coords.latitude ,
        lon:position.coords.longitude ,
    };
    console.log(userCoordinates);
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");
    //cityName =cityName.toLowerCase();
    console.log(cityName);
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e)
    {
        console("api call failed for search weather !!");
    }
    
}
// All Event Listners 

searchForm.addEventListener("submit",(e)=>
{
    e.preventDefault();
    let cityName = searchInput.value;
    console.log(cityName);
    if(cityName === "")
    {
        return ;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

grantAccessButton.addEventListener("click",()=>
{
    getLocation();
})
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})


// console.log('hello');
// const API_key="61f61e9ea47eeedebd2af8f5870e5f7b";
// //`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
// async function showWeather(){
    
//     let city= "mumbai";

//     const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
//     const data = await response.json();
//     console.log("Wether-> " , data);
//     //34 min
// }
