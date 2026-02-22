function WeatherCard({ data }) {
  return (
    <div>
      <h2>{data.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
        alt={data.weather[0].description}
      />
      <h3>{Math.round(data.main.temp)}°C</h3>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind: {data.wind.speed} m/s</p>
      <p>{data.weather[0].description}</p>
    </div>
  );
}

export default WeatherCard;
