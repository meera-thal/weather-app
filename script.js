const searchInputData = document.querySelector('.search-container')
const searchButton = document.querySelector('#search-btn')
const inputElement = searchInputData.querySelector('#city')
const resultBox = document.querySelector("#result")

const apiKey = '5558908df78a55af4fed380c69894074'
let city;

const errorMessage = function(error){
  const html =
  `
  <h3 class = "msg"> ${error.message}! Try again.</h3>
  `
resultBox.innerHTML = html;
}

searchButton.addEventListener('click', async function(e){
  try{
    e.preventDefault();
    city = inputElement.value;
    if(city.length===0) throw new Error('Please enter a city name')
    await coordData(city);

  }
  catch(error)
  {
    errorMessage(error);
  }
  
})

const coordData = async function(city){
  try{
    console.log(city)
    const apiCall = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${apiKey}`)
    console.log(apiCall)
  if(!apiCall.ok) throw new Error('Bad request')
   const data = await apiCall.json();
   console.log(data)
   if(data.length===0) throw new Error('Please enter a valid city name!');
  const[{lat,lon}]= data;
   await weatherData(lat,lon)

  }
  catch(error){
    
    throw error;
  }
  

} 

const weatherData = async function(lat,lon){
  try{
    const apiCall = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    const data = await apiCall.json();
    console.log(apiCall)
  if(apiCall.status !== 200)throw new Error('There is an internal error')
    UIlayout(data)
  await mapView(lat,lon,data)

  } catch(error){
   throw error;
  }

  
}


const UIlayout = function(data){
  resultBox.innerHTML = '';
  inputElement.value=''
  console.log(resultBox.innerHTML)
  const cityName = data.name;
  const tempMin = Math.trunc((data.main.temp_min) - 273.15);
  const tempMax = Math.trunc((data.main.temp_max) - 273.15);
  const temp = Math.trunc((data.main.temp) - 273.15)
  const description = data.weather[0].description;
  const imageIcon = data.weather[0].icon;
  console.log(tempMin, tempMax, description)

  const html =
`

          <h2>${data.name}</h2>
          <h4 class = "desc">${description}</h4>
          <img src="https://openweathermap.org/img/w/${imageIcon}.png" alt="image">
          <h1>${temp} &#176</h1>
          <div class="temp-container">
        <div>
          <h4 class="title"> min </h4>
          <h4 class="temp"> ${tempMin}&#176</h4>
        </div>
        <div>
          <h4 class="title"> max </h4>
          <h4 class="temp"> ${tempMax}&#176</h4>
        </div>
        
      </div>
      

`

resultBox.innerHTML=html;
   

}

const mapView = async function(lat,lon,data){
  try{

    const zoom = 5;
    var map = L.map('map').setView([lat, lon], zoom);

    if(!L||!L.tileLayer) throw new Error('Map not found')
  
   await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    
    L.marker([lat, lon]).addTo(map)
        .bindPopup(` ${Math.trunc((data.main.temp) - 273.15)}&#176 C`)
        .openPopup();
  } catch(error){
    throw error;
  }
}
