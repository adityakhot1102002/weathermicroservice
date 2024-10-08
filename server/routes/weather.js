const { error } = require("console"); // Retaining the original import
const express = require("express");
const https = require('https');
const path = require('path');
const Weather = require('../models/WeatherData'); // Import the Weather model
require('dotenv').config();

const weatherRoute = express.Router();

weatherRoute.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

weatherRoute.post("/", (req, res) => {
    const city = req.body.cityName;
    const apiKey = process.env.WEATHER_API_KEY;
    const unit = req.body.unit;

    if (!city || !unit) {
        return res.status(400).json({ error: "City name and unit are required" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${encodeURIComponent(unit)}`;

    https.get(url, (response) => {
        let data = '';
        response.on("data", (chunk) => {
            data += chunk;
        });
        response.on("end", async () => {
            try {
                const responseData = JSON.parse(data);
                if (responseData.main) {
                    const temperature = responseData.main.temp;
                    const weatherDes = responseData.weather[0].description;
                    const icon = responseData.weather[0].icon;
                    const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                    const cityName = responseData.name;

                    // Create a new Weather entry
                    const newWeather = new Weather({
                        cityName,
                        temperature,
                        description: weatherDes,
                        iconUrl: imageURL,
                        unit
                    });

                    // Save the entry to the database
                    await newWeather.save();

                    res.json({
                        temperature,
                        description: weatherDes,
                        iconUrl: imageURL,
                        cityName
                    });
                } else {
                    res.status(404).json({ error: "City not found or invalid API response" });
                }
            } catch (e) {
                console.error('Error processing API response:', e);
                res.status(500).json({ error: "Error processing API response" });
            }
        });
    }).on('error', (e) => {
        console.error('Request error:', e.message);
        res.status(500).json({ error: `Request error: ${e.message}` });
    });
});

module.exports = weatherRoute;