"use client"

import React from 'react'
import { Search, MapPin, Wind, Droplets, Sun, CloudRain, Thermometer, ArrowUp, ArrowDown, User, Loader2 } from 'lucide-react'
import { useWeather } from '@/hooks/useWeather'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const WeatherMap = dynamic<any>(() => import('./WeatherMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-secondary/50 animate-pulse rounded-[2.5rem] flex items-center justify-center text-muted">Loading Map...</div>
})

interface DashboardProps {
    isDarkMode?: boolean;
}

export default function Dashboard({ isDarkMode = true }: DashboardProps) {
    const { data, loading, setCity, isLive } = useWeather()
    const [searchValue, setSearchValue] = React.useState('')
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    const [suggestions, setSuggestions] = React.useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = React.useState(false)
    const [isSearching, setIsSearching] = React.useState(false)
    const [unit, setUnit] = React.useState<'C' | 'F'>('C')
    const [hourlyView, setHourlyView] = React.useState<'forecast' | 'trends'>('forecast')
    const [mapLayer, setMapLayer] = React.useState<'temp_new' | 'precipitation_new' | 'wind_new'>('temp_new')
    const [trendType, setTrendType] = React.useState<'temp' | 'precipitation' | 'windSpeed'>('temp')

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

    // Fetch suggestions when searchValue changes
    React.useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchValue.trim().length >= 3) {
                setIsSearching(true);
                try {
                    const res = await fetch(`${API_BASE}/search-cities?q=${searchValue}`);
                    const results = await res.json();
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (e) {
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchValue, API_BASE]);

    const getUVStatus = (uv: number) => {
        if (uv <= 2) return 'Low';
        if (uv <= 5) return 'Moderate';
        if (uv <= 7) return 'High';
        if (uv <= 10) return 'Very High';
        return 'Extreme';
    }

    const getWindStatus = (speed: number) => {
        if (speed < 1) return 'Calm';
        if (speed < 12) return 'Gentle';
        if (speed < 39) return 'Breeze';
        if (speed < 62) return 'Strong';
        return 'Storm';
    }

    const getTimeRelative = (timeStr: string, isPast: boolean) => {
        try {
            const now = new Date();
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const target = new Date();
            target.setHours(hours, minutes, 0, 0);

            const diff = Math.abs(target.getTime() - now.getTime());
            const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
            const minsDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (isPast) return `${hoursDiff}h ${minsDiff}m ago`;
            return `In ${hoursDiff}h ${minsDiff}m`;
        } catch (e) { return isPast ? 'Earlier today' : 'Later today'; }
    }

    const convertTemp = (celsius: number) => {
        if (unit === 'F') return Math.round((celsius * 9) / 5 + 32)
        return celsius
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchValue.trim()) {
            setCity(searchValue.trim())
            setShowSuggestions(false)
            searchInputRef.current?.blur()
        }
    }

    const selectCity = (city: any) => {
        setSearchValue(`${city.name}, ${city.country}`)
        setCity(city.name)
        setShowSuggestions(false)
        searchInputRef.current?.blur()
    }

    if (loading || !data) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <main className="p-4 md:p-8 text-foreground min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-4 w-full max-w-md">
                    <div className="md:hidden w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                        <img src="/logo.png" alt="SkySense Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="relative flex-1">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search City...."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                                className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-primary" size={20} />
                                </div>
                            )}
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl overflow-hidden z-[100] shadow-2xl glass-card backdrop-blur-2xl">
                                {suggestions.map((city, i) => (
                                    <button
                                        key={`${city.lat}-${city.lon}-${i}`}
                                        onClick={() => selectCity(city)}
                                        className="w-full px-6 py-4 flex items-center gap-3 hover:bg-primary/10 transition-colors text-left border-b border-white/5 last:border-0"
                                    >
                                        <MapPin size={16} className="text-primary" />
                                        <div>
                                            <p className="font-bold text-sm">{city.name}, {city.country}</p>
                                            {city.state && <p className="text-[10px] text-muted opacity-60 uppercase font-black">{city.state}</p>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={cn(
                        "hidden sm:block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        isLive ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                    )}>
                        {isLive ? 'Live' : 'Simulated'}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 bg-card px-2 md:px-4 py-2 rounded-2xl border border-border">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={18} className="text-primary" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column - Main Info */}
                <div className="xl:col-span-8 flex flex-col gap-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Main Weather Card */}
                        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col relative overflow-hidden group min-h-[350px]">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div className="flex items-center gap-2 bg-primary/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-primary/30">
                                    <MapPin size={14} className="text-primary" />
                                    <span className="text-xs md:text-sm font-semibold">{data.city}</span>
                                </div>
                                <div className="flex items-center bg-secondary p-1 rounded-full border border-border">
                                    <button
                                        onClick={() => setUnit('F')}
                                        className={cn("px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all", unit === 'F' ? "bg-white text-black" : "text-muted")}
                                    >F</button>
                                    <button
                                        onClick={() => setUnit('C')}
                                        className={cn("px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all", unit === 'C' ? "bg-white text-black" : "text-muted")}
                                    >C</button>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center relative z-10">
                                <h2 className="text-xl md:text-2xl font-bold mb-1 opacity-80">{data.date.split(',')[0]}</h2>
                                <p className="text-xs md:text-sm text-muted mb-6 md:mb-8">{data.date.split(',').slice(1).join(',')}</p>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-6xl md:text-8xl font-black tracking-tight">{convertTemp(data.temp)}°{unit}</h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-muted text-xs md:text-sm">High: <b className="text-foreground">{convertTemp(data.high)}°</b></span>
                                    <span className="text-muted text-xs md:text-sm">Low: <b className="text-foreground">{convertTemp(data.low)}°</b></span>
                                </div>
                            </div>

                            <div className="absolute right-4 md:right-8 bottom-4 md:bottom-8 text-right relative z-10">
                                <img
                                    src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`}
                                    alt={data.condition}
                                    className="w-24 h-24 md:w-32 md:h-32 mb-2 drop-shadow-2xl animate-pulse"
                                />
                                <h3 className="text-2xl md:text-3xl font-bold">{data.condition}</h3>
                                <p className="text-xs md:text-sm text-muted">Feels Like {convertTemp(data.feelsLike)}°{unit}</p>
                            </div>

                            {/* Background Glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                        </div>

                        {/* Today Highlights Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Chance of Rain', value: `${data.chanceOfRain}%`, icon: CloudRain, color: 'text-blue-400', status: data.chanceOfRain > 50 ? 'High Risk' : 'Low Risk' },
                                { label: 'UV Index', value: data.uvIndex, icon: Sun, color: 'text-yellow-400', status: getUVStatus(data.uvIndex) },
                                { label: 'Wind Status', value: `${data.windSpeed} km/h`, icon: Wind, color: 'text-cyan-400', status: getWindStatus(data.windSpeed) },
                                { label: 'Humidity', value: `${data.humidity}%`, icon: Droplets, color: 'text-blue-500', status: data.humidity > 60 ? 'High' : 'Normal' },
                            ].map((item, idx) => (
                                <div key={idx} className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] md:text-xs text-muted font-bold uppercase tracking-wider">{item.label}</span>
                                        <item.icon size={18} className={item.color} />
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-xl md:text-2xl font-black mb-1 text-foreground">{item.value}</div>
                                        <div className="text-[8px] md:text-[10px] font-bold text-muted uppercase tracking-widest">{item.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Hourly Forecast */}
                        <div className="md:col-span-8 glass-card rounded-[2.5rem] p-8 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Today / Week</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setHourlyView('forecast')}
                                        className={cn("px-3 py-1 text-xs font-bold rounded-lg border transition-all", hourlyView === 'forecast' ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary text-muted border-transparent")}
                                    >Forecast</button>
                                    <button
                                        onClick={() => setHourlyView('trends')}
                                        className={cn("px-3 py-1 text-xs font-bold rounded-lg border transition-all", hourlyView === 'trends' ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary text-muted border-transparent")}
                                    >Trends</button>
                                </div>
                            </div>

                            {hourlyView === 'forecast' ? (
                                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-6 animate-in fade-in duration-500">
                                    {data.hourly.map((hour, i) => (
                                        <div key={i} className={cn(
                                            "min-w-[100px] flex flex-col items-center p-4 rounded-3xl border transition-all hover:translate-y-[-4px]",
                                            i === 0 ? "bg-primary/20 border-primary/30 shadow-[0_8px_20px_rgba(138,79,255,0.15)]" : "bg-secondary/40 border-border"
                                        )}>
                                            <span className="text-xs text-muted mb-3 font-semibold">{hour.time}</span>
                                            <img
                                                src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                                                alt={hour.condition}
                                                className="w-8 h-8 mb-3"
                                            />
                                            <span className="text-lg font-bold">{convertTemp(hour.temp)}°</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex gap-4 mb-6">
                                        {(['temp', 'precipitation', 'windSpeed'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTrendType(t)}
                                                className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all",
                                                    trendType === t ? "bg-primary text-foreground border-primary" : "bg-secondary/50 text-muted border-border hover:border-primary/50"
                                                )}
                                            >
                                                {t === 'windSpeed' ? 'Wind' : t}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="h-48 min-h-[192px] w-full mt-auto relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data.hourly}>
                                                <defs>
                                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8A4FFF" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#8A4FFF" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: isDarkMode ? '#15181E' : '#FFFFFF',
                                                        border: `1px solid ${isDarkMode ? '#232832' : '#E5E7EB'}`,
                                                        borderRadius: '12px'
                                                    }}
                                                    itemStyle={{ color: isDarkMode ? '#FFFFFF' : '#111827' }}
                                                    formatter={(val: number | undefined) => {
                                                        if (val === undefined) return ['', ''];
                                                        return [
                                                            trendType === 'temp' ? `${convertTemp(val)}°${unit}` :
                                                                trendType === 'precipitation' ? `${val}%` : `${val} km/h`,
                                                            trendType.charAt(0).toUpperCase() + trendType.slice(1)
                                                        ]
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey={trendType === 'temp' ? (d => d.temp) : trendType}
                                                    stroke="#8A4FFF"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorTrend)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Day Length / Sun */}
                        <div className="md:col-span-4 glass-card rounded-[2.5rem] p-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs text-muted uppercase font-black tracking-widest block mb-3">Sunrise</span>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                            <Sun size={24} />
                                        </div>
                                        <div>
                                            <span className="text-2xl font-black">{data.sunrise}</span>
                                            <p className="text-[10px] text-muted font-bold">
                                                {getTimeRelative(data.sunrise, true)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-border/50 w-full" />
                                <div>
                                    <span className="text-xs text-muted uppercase font-black tracking-widest block mb-3">Sunset</span>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                            <Sun size={24} />
                                        </div>
                                        <div>
                                            <span className="text-2xl font-black">{data.sunset}</span>
                                            <p className="text-[10px] text-muted font-bold">
                                                {getTimeRelative(data.sunset, false)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-secondary/30 rounded-3xl border border-border/50">
                                <span className="text-xs text-muted uppercase font-black tracking-widest block mb-2">Length of day</span>
                                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-muted">{data.lengthOfDay}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Other Cities & Global Map Preview */}
                <div className="xl:col-span-4 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Other Cities</h3>
                        <button className="text-sm font-semibold text-primary px-4 py-1 rounded-full bg-primary/10">Show All</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                        {data.otherCities.map((city, i) => (
                            <div
                                key={i}
                                onClick={() => setCity(city.name)}
                                className="glass-card rounded-[2rem] p-6 group hover:translate-x-1 transition-transform cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-4xl font-black">{convertTemp(city.temp)}°</h4>
                                        <p className="text-muted text-sm">{city.name}</p>
                                    </div>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                                        alt={city.condition}
                                        className="w-10 h-10 group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted font-bold">
                                    <span>H: {convertTemp(city.high)}° L: {convertTemp(city.low)}°</span>
                                    <span className="text-primary">{city.country}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 flex-1 relative overflow-hidden flex flex-col">
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">Global Forecast</h3>
                            <div className="p-2 bg-secondary rounded-xl border border-border">
                                <MapPin size={16} />
                            </div>
                        </div>

                        <div className="flex-1 rounded-[2rem] bg-secondary/50 border border-border flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/0,0,1/800x600?access_token=pk.eyJ1IjoiYmFyYW5vZmYiLCJhIjoiY2p4bXN6YXRhMDNnZDN6cDlsZGd6djJpZiJ9.7xXF8xXW_Z_Z_Z_Z_Z_Z_Z')] bg-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10 text-center p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 m-4">
                                <p className="text-sm font-bold mb-2">Interactive Map</p>
                                <button
                                    onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-primary hover:bg-primary/80 text-foreground px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(138,79,255,0.4)]"
                                >
                                    View Map
                                </button>
                            </div>
                        </div>

                        {/* Gradient overlay on bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
                    </div>

                    {/* 7-Day Forecast Summary */}
                    <div className="glass-card rounded-[2.5rem] p-8">
                        <h3 className="text-xl font-bold mb-6">Upcoming Forecast</h3>
                        <div className="space-y-4">
                            {data.daily.map((day, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                                    <span className="font-bold w-24 text-sm">{day.day}</span>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                            alt={day.condition}
                                            className="w-8 h-8"
                                        />
                                        <span className="text-xs text-muted font-bold">{day.condition}</span>
                                    </div>
                                    <span className="font-black text-sm">
                                        {convertTemp(parseInt(day.temp.split('/')[0]))}/{convertTemp(parseInt(day.temp.split('/')[1]))}°
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div id="map-section" className="mt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black">Global Temperature Map</h2>
                        <p className="text-muted">Explore real-time weather data across the globe</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setMapLayer('temp_new')}
                            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", mapLayer === 'temp_new' ? "bg-primary text-white" : "bg-secondary text-muted hover:text-white")}
                        >Temperature</button>
                        <button
                            onClick={() => setMapLayer('precipitation_new')}
                            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", mapLayer === 'precipitation_new' ? "bg-primary text-white" : "bg-secondary text-muted hover:text-white")}
                        >Precipitation</button>
                        <button
                            onClick={() => setMapLayer('wind_new')}
                            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", mapLayer === 'wind_new' ? "bg-primary text-white" : "bg-secondary text-muted hover:text-white")}
                        >Wind Speed</button>
                    </div>
                </div>
                <WeatherMap lat={data.lat} lon={data.lon} city={data.city} temp={convertTemp(data.temp)} zoom={3} layer={mapLayer} isDarkMode={isDarkMode} />
            </div>
        </main>
    )
}
