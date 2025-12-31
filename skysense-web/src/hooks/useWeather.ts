"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'

export interface WeatherData {
    city: string;
    country: string;
    temp: number;
    high: number;
    low: number;
    condition: string;
    feelsLike: number;
    date: string;
    chanceOfRain: number;
    uvIndex: number;
    windSpeed: number;
    humidity: number;
    sunrise: string;
    sunset: string;
    lengthOfDay: string;
    hourly: { time: string; temp: number; icon: string; condition: string; precipitation: number; windSpeed: number }[];
    daily: { day: string; temp: string; icon: string; condition: string }[];
    icon: string;
    lat: number;
    lon: number;
    otherCities: { name: string; country: string; temp: number; high: number; low: number; condition: string; icon: string }[];
}

const API_BASE = 'http://127.0.0.1:5000/api';

export function useWeather() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState<string | null>(null); // Start with null to detect first load
    const [isLive, setIsLive] = useState(false);

    // Initial Geolocation and Main Fetch
    useEffect(() => {
        const initializeWeather = async () => {
            setLoading(true);
            try {
                let params: any = {};

                // Step 1: Try Geolocation if no city is explicitly searched
                if (!city) {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        params = { lat: position.coords.latitude, lon: position.coords.longitude };
                        console.log("Using browser geolocation...");
                    } catch (geoError) {
                        console.warn("Geolocation failed or denied, using default city (London).", geoError);
                        params = { city: "London" };
                    }
                } else {
                    params = { city };
                }

                // Step 2: Fetch Main weather data
                const response = await axios.get(`${API_BASE}/weather-data`, { params });
                const d = response.data;

                // Map One Call 3.0 data
                const mainData: WeatherData = {
                    city: d.location.name,
                    country: d.location.country,
                    temp: Math.round(d.current.temp),
                    high: Math.round(d.daily[0].temp.max),
                    low: Math.round(d.daily[0].temp.min),
                    condition: d.current.weather[0].main,
                    icon: d.current.weather[0].icon,
                    feelsLike: Math.round(d.current.feels_like),
                    date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
                    chanceOfRain: Math.round((d.daily[0].pop || 0) * 100),
                    uvIndex: Math.round(d.current.uvi),
                    windSpeed: Math.round(d.current.wind_speed * 3.6),
                    humidity: d.current.humidity,
                    sunrise: new Date(d.current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sunset: new Date(d.current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    lengthOfDay: `${Math.floor((d.current.sunset - d.current.sunrise) / 3600)}h ${Math.floor(((d.current.sunset - d.current.sunrise) % 3600) / 60)}m`,
                    hourly: d.hourly.slice(0, 12).map((item: any) => ({
                        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).replace(':00', ''),
                        temp: Math.round(item.temp),
                        icon: item.weather[0].icon,
                        condition: item.weather[0].main,
                        precipitation: Math.round((item.pop || 0) * 100),
                        windSpeed: Math.round(item.wind_speed * 3.6)
                    })),
                    daily: d.daily.slice(1, 8).map((item: any) => ({
                        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
                        temp: `${Math.round(item.temp.max)}/${Math.round(item.temp.min)}`,
                        icon: item.weather[0].icon,
                        condition: item.weather[0].main
                    })),
                    lat: d.lat,
                    lon: d.lon,
                    otherCities: []
                };

                // Step 3: Fetch 'Other Cities'
                const otherCityNames = ["New York", "Dubai", "Tokyo", "London", "Ibadan", "Lagos"];
                const otherCitiesData = await Promise.all(
                    otherCityNames.map(async (name) => {
                        try {
                            const res = await axios.get(`${API_BASE}/weather-data`, { params: { city: name } });
                            const cd = res.data;
                            return {
                                name: cd.location.name,
                                country: cd.location.country,
                                temp: Math.round(cd.current.temp),
                                high: Math.round(cd.daily[0].temp.max),
                                low: Math.round(cd.daily[0].temp.min),
                                condition: cd.current.weather[0].main,
                                icon: cd.current.weather[0].icon
                            };
                        } catch (e) { return null; }
                    })
                );

                setData({ ...mainData, otherCities: otherCitiesData.filter(Boolean) as any });
                setIsLive(true);
            } catch (err) {
                console.error("Critical Fetch Error:", err);
                setIsLive(false);
            } finally {
                setLoading(false);
            }
        };

        initializeWeather();
    }, [city]);

    return { data, loading, setCity, isLive };
}
