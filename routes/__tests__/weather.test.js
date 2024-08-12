const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const WeatherModel = require('../../models/WeatherData');
const weatherRouter = require('../weather');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(express.json());
app.use('/weather', weatherRouter);

// Create an instance of MongoMemoryServer
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('POST /weather', () => {
  it('should add weather data to the database', async () => {
    const response = await request(app)
      .post('/weather')
      .send({
        cityName: 'Bengaluru',
        unit: 'Kelvin'
      })
      .expect(200);

    expect(response.body).toHaveProperty('temperature');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('iconUrl');
    expect(response.body).toHaveProperty('cityName');

    const weather = await WeatherModel.findOne({ cityName: 'Bengaluru' });
    expect(weather).toBeTruthy();
    expect(weather.temperature).toBeDefined();
    expect(weather.description).toBeDefined();
    expect(weather.iconUrl).toBeDefined();
  });
});

describe('POST /weather with missing data', () => {
  it('should return an error if city name or unit is missing', async () => {
    const response = await request(app)
      .post('/weather')
      .send({
        cityName: '',
        unit: ''
      })
      .expect(400);

    expect(response.body.error).toBe('City name and unit are required');
  });
});
