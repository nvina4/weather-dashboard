
export default function Forecast({days}) {

    return (
      <div className="forecast-wrapper">
        <div className="forecast-row">
          {days.map((day) => {
            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

            return (
              <div key={day.date}>
                <p>{day.date}</p>
                <img src={iconUrl} alt={day.description} />
                <p> High: {day.high} / Low: {day.low}</p>
                <p>{day.description}</p>
              </div>
            );
          })}
        </div>
    </div>
  );
}
