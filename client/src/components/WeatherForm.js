// src/components/WeatherForm.js
import React, { useState } from 'react';
import axios from 'axios';

function WeatherForm({ setWeatherData, setError }) {
  const [cityName, setCityName] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName || !unit) {
      setError('City name and unit are required');
      return;
    }

    try {
      const response = await axios.post('/weather', { cityName, unit });
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setWeatherData(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="cityInput">City name:</label>
      <input
        type="text"
        name="cityName"
        placeholder="Enter name of your city"
        id="cityInput"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
      />
      <label htmlFor="unitInput">Unit:</label>
      <input
        type="text"
        name="unit"
        placeholder="Enter unit (e.g., metric)"
        id="unitInput"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default WeatherForm;
