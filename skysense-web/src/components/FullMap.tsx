"use client"

import React from 'react'
import { MapPin, Thermometer, Droplets, Wind, Layers } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useWeather } from '@/hooks/useWeather'
import { cn } from '@/lib/utils'

const WeatherMap = dynamic<any>(() => import('./WeatherMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-secondary/50 animate-pulse rounded-[2.5rem] flex items-center justify-center text-muted">Loading Map...</div>
})

interface FullMapProps {
    isDarkMode?: boolean;
}

export default function FullMap({ isDarkMode = true }: FullMapProps) {
    const { data } = useWeather()
    const [layer, setLayer] = React.useState<'temp_new' | 'precipitation_new' | 'wind_new'>('temp_new')

    if (!data) return null

    return (
        <div className="p-4 md:p-8 text-foreground min-h-screen md:h-screen flex flex-col animate-in fade-in duration-700 transition-colors duration-500">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2">Global Explorer</h1>
                    <p className="text-muted text-sm">Interactive atmospheric layers across the globe.</p>
                </div>

                <div className="flex bg-card p-1 rounded-2xl border border-border w-full xl:w-auto overflow-x-auto no-scrollbar">
                    {[
                        { id: 'temp_new', label: 'Temperature', icon: Thermometer },
                        { id: 'precipitation_new', label: 'Rain', icon: Droplets },
                        { id: 'wind_new', label: 'Wind', icon: Wind },
                    ].map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setLayer(l.id as any)}
                            className={cn(
                                "flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex-1 xl:flex-none",
                                layer === l.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted hover:text-white"
                            )}
                        >
                            <l.icon size={16} />
                            <span className="hidden sm:inline">{l.label}</span>
                            <span className="sm:hidden">{l.label === 'Temperature' ? 'Temp' : l.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex-1 relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-border group min-h-[400px]">
                <WeatherMap
                    lat={data.lat}
                    lon={data.lon}
                    city={data.city}
                    temp={data.temp}
                    zoom={3}
                    layer={layer}
                    isDarkMode={isDarkMode}
                />

                {/* Floating Info Overlay (Desktop only or adjusted) */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 p-4 md:p-6 glass-card rounded-3xl border border-white/10 z-10 w-48 md:w-64 backdrop-blur-xl">
                    <h4 className="text-[10px] md:text-xs uppercase font-black tracking-widest text-muted mb-3 md:mb-4">Legend</h4>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] md:text-xs font-bold">Intensity</span>
                            <div className="w-16 md:w-24 h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded-full" />
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Layers size={14} />
                            </div>
                            <div>
                                <p className="text-[8px] md:text-[10px] font-black uppercase text-muted">Layer</p>
                                <p className="text-[10px] md:text-xs font-bold capitalize">{layer.replace('_new', '')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
