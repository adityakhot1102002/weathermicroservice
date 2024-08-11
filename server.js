const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const aboutRouter = require("./routes/about");
const weatherRouter = require("./routes/weather");

const PORT = 3000;
const HOST_NAME = "localhost";

const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://adityakhot:bighaat@cluster0.wnixd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // to parse JSON data sent from React frontend

// Routes
app.use("/weather", weatherRouter);
app.use("/about", aboutRouter);

// Start Server
app.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at ${HOST_NAME}:${PORT}`);
});
