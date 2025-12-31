const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

const OWM_API_KEY = process.env.OWM_API_KEY?.trim();
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';

console.log('SkySense Server initializing...');
console.log('API Key configured:', OWM_API_KEY ? `${OWM_API_KEY.substring(0, 5)}...` : 'MISSING');

// Helper to get coordinates from city name
async function getCoords(city) {
    const res = await axios.get(GEO_URL, {
        params: { q: city, limit: 1, appid: OWM_API_KEY }
    });
    if (!res.data || res.data.length === 0) throw new Error('City not found');
    return { lat: res.data[0].lat, lon: res.data[0].lon, name: res.data[0].name, country: res.data[0].country };
}

app.get('/api/weather-data', async (req, res) => {
    const { city, lat, lon } = req.query;

    try {
        let coords;
        if (lat && lon) {
            coords = { lat: parseFloat(lat), lon: parseFloat(lon), name: 'Your Location', country: '' };
        } else if (city) {
            console.log(`FETCHING One Call 3.0 for City: ${city}`);
            coords = await getCoords(city);
        } else {
            return res.status(400).json({ error: 'City or Coordinates required' });
        }

        const response = await axios.get(ONE_CALL_URL, {
            params: {
                lat: coords.lat,
                lon: coords.lon,
                exclude: 'minutely,alerts',
                appid: OWM_API_KEY,
                units: 'metric'
            }
        });

        // Reverse geocode if it's from coordinates to get a real city name
        if (lat && lon) {
            try {
                const geoRes = await axios.get('http://api.openweathermap.org/geo/1.0/reverse', {
                    params: { lat: coords.lat, lon: coords.lon, limit: 1, appid: OWM_API_KEY }
                });
                if (geoRes.data && geoRes.data.length > 0) {
                    coords.name = geoRes.data[0].name;
                    coords.country = geoRes.data[0].country;
                }
            } catch (e) {
                console.error('Reverse Geocoding failed:', e.message);
            }
        }

        res.json({
            ...response.data,
            location: { name: coords.name, country: coords.country }
        });
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || error.message || 'Failed to fetch weather data'
        });
    }
});

app.listen(PORT, () => {
    console.log(`SkySense Server running on http://localhost:${PORT}`);
});
