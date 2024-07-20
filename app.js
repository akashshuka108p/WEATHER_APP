const express = require('express');
const app = express();
const port = 8080;
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';

// Set the view engine to EJS for rendering templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Route to display the home page with the weather form
app.get("/", (req, res) => {
    res.render("index.ejs", { weather: null, error: 'Please enter a location' });
});

// Route to handle the weather form submission
app.post("/weather", async (req, res) => {
    const location = req.body.location; // Get the location input from the form

    // Check if location is provided
    if (!location) {
        res.render("index", { weather: null, error: 'Please enter a location' });
        return;
    }

    try {
        // Fetch weather data from the OpenWeatherMap API
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                q: location,
                appid: process.env.WEATHER_API_KEY,
                units: 'metric' // Use 'imperial' for Fahrenheit
            }
        });

        const weatherData = response.data;
        const weather = {
            location: weatherData.name,
            temperature: `${weatherData.main.temp}°C`,
            description: weatherData.weather[0].description
        };

        // Render the weather data on the index.ejs page
        res.render("index.ejs", { weather, error: null });
    } catch (error) {
        // Handle errors, such as invalid location or API issues
        res.render("index.ejs", { weather: null, error: 'Cannot retrieve weather data' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Listening to the server on port ${port}`);
});
