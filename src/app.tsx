import * as React from 'react';
import { useState, useEffect } from 'react';
import CloudImage from './components/img-cloudimage';
import WeatherDesc from './components/h4-weather';
import Location from './components/h2-location';
import Temperature from './components/h1-temperature';

function App() {
  const [inputValue, setInputValue] = useState('Raleigh');
  const [temperature, setTemperature] = useState();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState();
  const [icon, setIcon] = useState('02d');//sun w cloud default
  let iconImage = `http://openweathermap.org/img/wn/${icon}@4x.png`;

  //pressing enter fires the fetch data function
  const apiLookup = ev => {
    if (ev.key === "Enter") {
        FetchData();
    }
  }

  //fetch data from external api
  const FetchData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=imperial&APPID=${process.env.REACT_APP_API_KEY}`)
      .then(res => res.json())
      .then(result => {

        //get 'city, country'
        setCity(result.name + ', ');
        setCountry(result.sys.country);

        //get the weather type
        setDescription(result.weather[0].description);
        setIcon(result.weather[0].icon);

        //h1 will show NaN if temperature isn't hidden on page load
        setTemperature(result.main.temp)
        document.getElementById('location-temp-background').style["display"] = 'inherit';

        //change background color via function changeBGC
        changeBGC(result.weather[0].id);

        //reset search box
        setInputValue('');
    });}

  //color changing hooks
  const [bGC, setBGC] = useState('rgb(255, 253, 240)');
  const [color, setColor] = useState('orange');
  const [inputColor, setInputColor] = useState('white');
  
  function changeBGC(id) {
    //these numbers are from https://openweathermap.org/weather-conditions
    const body = document.querySelector('body');
    switch (true) {
      case ((id > 200) && (300 > id)):
        setBGC('rgb(252, 193, 0)'); //thunderstorm
        setColor('yellow');
        setInputColor('yellow');
        body.setAttribute('backgroundColor','darkblue')
        break;
      case ((id > 300) && (400 > id)) :
        setBGC('rgb(0, 29, 96)'); //drizzle
        setColor('rgb(205, 205, 205)');
        setInputColor('rgb(205, 205, 205)');
        body.setAttribute('backgroundColor','blue')
        break;
      case ((id > 500) && (600 > id)):
        setBGC('rgb(0, 29, 120)'); //rain
        setColor('rgb(205, 205, 205)');
        setInputColor('rgb(205, 205, 205)');
        body.setAttribute('backgroundColor','darkblue')
        break;
      case ((id > 600) && (700 > id)):
        setBGC('white'); //snow
        setColor('grey');
        setInputColor('grey');
        body.setAttribute('backgroundColor','grey')
        break;
      case ((id > 700) && (800 > id)):
        setBGC('rgb(200, 200, 200)'); //atmosphere
        setColor('white');
        setInputColor('white');
        body.setAttribute('backgroundColor','grey')
        break;
      case (id === 800):
        setBGC('rgb(33, 129, 255)'); //clear
        setColor('rgb(250, 255, 225)');
        setInputColor('rgb(250, 255, 225)');
        body.setAttribute('backgroundColor','lightblue')
        break;
      default:
        setBGC('rgb(33, 129, 255)') //clouds
        setColor('white');
        setInputColor('white');
        body.setAttribute('backgroundColor','lightblue')
    }
  }

  //search Raleigh on page load
  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className='container'>

      <div className='weather-container' 
           style={{backgroundColor: bGC}}>

        <input className='search-bar'
              type='text'
              placeholder='Search...'
              onChange={ev => setInputValue(ev.target.value)}
              value={inputValue}
              onKeyPress={apiLookup}
              style={{backgroundColor: inputColor}}/>

        <div id='location-temp-background'
             style={{display:'none'}}>
              <Location 
                myCity = {city}
                myCountry={country}
                font_color={color}/>

              <Temperature 
                roundedTemp={Math.round(temperature)}
                font_color={color}/>
        </div>

        <CloudImage 
          image={iconImage}/>

        <WeatherDesc 
          weather_description={description}
          font_color={color}/>

      </div>

    </div>
  )
}

export default App;