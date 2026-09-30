import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import Forecast from './components/Forecast.jsx';
import './App.css';

function kelvinToCelsius(kelvin) {

  return kelvin - 273.15;
}

function kelvinToFahrenheit(kelvin) {
  return (kelvin - 273.15) * 9 / 5 + 32;
}

export default function App() {

    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState("Celsius");
    const [forecastData, setForecastData] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const grouped = {};
    forecastData?.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!grouped[date]) {
            grouped[date] = [];
        }

        grouped[date].push(item);
    });

    const dailyForecasts = Object.keys(grouped).map((date) => {
        const items = grouped[date]; 
        const temps = items.map((item) => item.main.temp);

        const high = Math.max(...temps);
        const low = Math.min(...temps);

        return {
            date : date,
            high : high,
            low : low,
            description :items[0].weather[0].description,
            icon: items[0].weather[0].icon
        };
    });

    async function fetchWeather (cityName) {

        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        setIsLoading(true);
        setError(null);
        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("City not found. Please check the spelling.");
            };

            const data = await response.json();
            setWeatherData(data);
            localStorage.setItem("lastCity", cityName);
            console.log(data);

            const forecasrResponse = await fetch(forecastUrl);
            const forecastJson = await forecasrResponse.json();
            setForecastData(forecastJson);
            console.log(forecastJson);


        } catch(error) {
            setError(error.message);
            setWeatherData(null);
            setForecastData(null);
            
            
        } finally {
            setIsLoading(false);
        };
    };

    function handleSearch(e) {
        e.preventDefault();
        fetchWeather(city)
    }

    const handleToggle = () => {
        setIsDarkMode (prev => !prev);
    }
     
    const displayTemp = weatherData
  ? (unit === "Celsius" ? kelvinToCelsius(weatherData.main.temp) : kelvinToFahrenheit(weatherData.main.temp))
  : null;

    const convertedForecast = dailyForecasts.map((day) => {
        return {
            ...day,
            high: (unit === 'Celsius' ? kelvinToCelsius(day.high) : kelvinToFahrenheit(day.high)).toFixed(1),
            low: (unit === 'Celsius' ? kelvinToCelsius(day.low) : kelvinToFahrenheit(day.low)).toFixed(1),
        };
    });

  useEffect (() => {
    const savedCity = localStorage.getItem("lastCity")

    if (savedCity) {
        setCity(savedCity)
        fetchWeather(savedCity)
    }
  }, [])

    return (
    <div style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#000000", minHeight: "100vh", padding: "20px" }}>

        <div className="top-bar">
            <div className="top-bar-left">
                <form className="search-bar" onSubmit={handleSearch}>
                    <SearchBar value={city} onChange={setCity}/>
                    <button type='submit'>Search</button>
                </form>
            </div>

            <div className="top-bar-center">
                Weather Dashboard
            </div>

            <div className="top-bar-right">
                <button onClick={() => setUnit(unit === 'Celsius' ? "Fahrenheit" : "Celsius")}>
                    {unit === "Celsius" ? "Show °F" : "Show °C"}
                </button>
                <button onClick={handleToggle}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
            </div>
        </div>

        {isLoading && (
            <p style={{ textAlign: "center" }}>Loading...</p>
        )}

        {weatherData && (
            <div className="current-weather" style={{ backgroundColor: isDarkMode ? "#2a2a2a" : "#f9f9f9" }}>
                <WeatherCard detail={weatherData} temp={displayTemp.toFixed(1)}/>
            </div>
        )}

        {forecastData && (
            <div style={{ 
                backgroundColor: isDarkMode ? "#2a2a2a" : "#fafafa",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                borderRadius: "20px",
                maxWidth: "90%",
                margin: "0 auto",
                overflow: "hidden"
             }}>
                <Forecast days={convertedForecast} isDarkMode={isDarkMode}/>
            </div>
        )}

        {error && (
            <p style={{ textAlign: "center" }}>{error}</p>
        )}

    </div>
); 
};