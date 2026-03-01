import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


  const backgrounds = {
    Clear: "https://wallpaperaccess.com/thumb/175910.jpg",
    Clouds:"https://wallpaperaccess.com/thumb/896978.jpg",
    Rain: "https://wallpaperaccess.com/thumb/164284.jpg",
    Drizzle: "https://wallpaperaccess.com/full/9351041.jpg",
    Thunderstorm:"https://wallpaperaccess.com/thumb/1563505.jpg",
    Snow: "https://wallpaperaccess.com/thumb/820200.jpg",
    Mist: "https://wallpaperaccess.com/thumb/7101031.jpg",
    Fog: "https://wallpaperaccess.com/thumb/2467220.jpg",
    Default: "https://wallpaperaccess.com/thumb/4614268.jpg",
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherHistory"));
    if (saved) setHistory(saved);
    document.body.style.backgroundImage = `url(${backgrounds.Default})`;
  }, []);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error("City not found");

      setWeather(data);

      const condition = data.weather[0].main;
      document.body.style.backgroundImage = `url(${
        backgrounds[condition] || backgrounds.Default
      })`;

      const updatedHistory = [
        data.name,
        ...history.filter((c) => c !== data.name),
      ].slice(0, 5);

      setHistory(updatedHistory);
      localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteCityFromHistory = (cityToRemove) => {
    const updatedHistory = history.filter((city) => city !== cityToRemove);
    setHistory(updatedHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("weatherHistory");
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      <SearchBar onSearch={fetchWeather} />

      {history.length > 0 && (
        <>
          <div className="history">
            {history.map((city) => (
              <div key={city} className="history-item">
                <button onClick={() => fetchWeather(city)}>{city}</button>
                <span
                  className="delete"
                  onClick={() => deleteCityFromHistory(city)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>

          <button className="clear-history" onClick={clearHistory}>
            Clear History
          </button>
        </>
      )}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;
