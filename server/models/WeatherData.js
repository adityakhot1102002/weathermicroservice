const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    cityName: String,
    temperature: Number,
    description: String,
    iconUrl: String,
    date: { type: Date, default: Date.now }
});

const Weather = mongoose.model('WeatherData', weatherSchema);

module.exports = Weather;