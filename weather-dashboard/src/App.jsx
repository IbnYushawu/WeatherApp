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

  const API_KEY = "eee608659d3bb0820bd3ae895ac87e6b";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if (savedHistory) setHistory(savedHistory);
  }, []);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error("City not found");
      }

      setWeather(data);

      // Update history (keep max 5)
      const updatedHistory = [data.name, ...history.filter((c) => c !== data.name)].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Weather Dashboard</h1>

      <SearchBar onSearch={fetchWeather} />

      {/* History Buttons */}
      {history.length > 0 && (
        <div>
          {history.map((city) => (
            <button key={city} onClick={() => fetchWeather(city)}>
              {city}
            </button>
          ))}
        </div>
      )}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {weather && <WeatherCard data={weather} />}
    </div>
  );
}

export default App;
