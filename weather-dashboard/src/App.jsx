import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "eee608659d3bb0820bd3ae895ac87e6b";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message || "City not found");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Weather Dashboard</h1>

      <SearchBar onSearch={fetchWeather} />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;
