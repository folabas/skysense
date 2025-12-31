"use client"

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Component to handle map view changes
function MapView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface WeatherMapProps {
    lat: number;
    lon: number;
    city: string;
    temp: number;
    layer?: string;
    isDarkMode?: boolean;
}

export default function WeatherMap({ lat, lon, city, temp, layer = 'temp_new', isDarkMode = true }: WeatherMapProps) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Fix for leaflet icons in Next.js
    const icon = L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    })

    const center: [number, number] = [lat, lon];

    return (
        <div className="w-full h-[600px] rounded-[2.5rem] overflow-hidden border border-border mt-8 relative z-0">
            <MapContainer
                center={center}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                touchZoom={true}
                dragging={true}
            >
                <MapView center={center} zoom={6} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={isDarkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
                />

                <TileLayer
                    url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=133a666905171faa4654b0923db9fbc1`}
                    opacity={0.4}
                />

                <Marker position={center} icon={icon}>
                    <Popup>
                        {city} <br /> {temp}°C
                    </Popup>
                </Marker>
            </MapContainer>

            <div className="absolute bottom-6 left-6 right-6 p-4 bg-card/80 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between z-[1000]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-xs text-muted font-bold">Cold (-10°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-xs text-muted font-bold">Warm (20°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-xs text-muted font-bold">Hot (40°C)</span>
                    </div>
                </div>
                <p className="text-[10px] text-muted uppercase font-black tracking-widest">Global Heat Visualization</p>
            </div>
        </div>
    )
}
