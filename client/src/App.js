// src/App.js
import React, { useState } from 'react';
import WeatherForm from './components/WeatherForm';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="App">
      <h1>A Basic Weather App</h1>
      <WeatherForm setWeatherData={setWeatherData} setError={setError} />

      {weatherData && (
        <div>
          <h2>Weather in {weatherData.cityName}</h2>
          <p>Temperature: {weatherData.temperature} Kelvin</p>
          <p>Description: {weatherData.description}</p>
          <img src={weatherData.iconUrl} alt={weatherData.description} />
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
