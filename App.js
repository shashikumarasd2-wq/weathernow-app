import React, { useState } from "react";
import "./style.css"; // custom CSS file

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("❌ City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country: country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        time: weatherData.current_weather.time,
      });
    } catch (err) {
      setError("⚠️ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1 className="title">🌦 Weather Now for Jamie</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {loading && <p className="loading">⏳ Fetching weather...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <p className="temp">{weather.temperature}°C</p>
          <p>💨 {weather.windspeed} km/h</p>
          <p className="time">
            Last updated: {new Date(weather.time).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
