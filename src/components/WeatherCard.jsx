
export default function WeatherCard({detail, temp}) {

    const icon = detail.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const name = detail.name;
    const humidity = detail.main.humidity;
    const windSpeed = detail.wind.speed;
    const description = detail.weather[0].description;
    

    return (
        <div>

            <h2>{name}</h2>
            <img src={iconUrl} alt={description} />
            <p>Temperature: {temp}°</p>
            <p>Humidity: {humidity}%</p>
            <p>Wind Speed: {windSpeed} m/s</p>
            <p>{description}</p>

        </div>


    );

};