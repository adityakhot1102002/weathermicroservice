const { error } = require("console"); // Retaining the original import
const express = require("express");
const https = require('https');
const path = require('path');

// Create the router instance
const weatherRoute = express.Router();

weatherRoute.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

weatherRoute.post("/", (req, res) => {
    const city = req.body.cityName;
    const apiKey = "0a2c25ce16e96eb5514bf2505f4dabe3";
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
        response.on("end", () => {
            try {
                const responseData = JSON.parse(data);
                console.log(responseData); // Correctly logging responseData
                if (responseData.main) {
                    const temperature = responseData.main.temp;
                    const weatherDes = responseData.weather[0].description;
                    const icon = responseData.weather[0].icon;
                    const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                    const cityName = responseData.name;

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
                res.status(500).json({ error: "Error processing API response" });
            }
        });
    }).on('error', (e) => {
        res.status(500).json({ error: `Request error: ${e.message}` });
    });
});

// Export the router
module.exports = weatherRoute;
