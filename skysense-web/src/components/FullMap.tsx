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
        <div className="flex-1 ml-20 lg:ml-24 p-8 text-foreground h-screen flex flex-col animate-in fade-in duration-700 transition-colors duration-500">
            <header className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-black mb-2">Global Explorer</h1>
                    <p className="text-muted">Interactive atmospheric layers across the globe.</p>
                </div>

                <div className="flex bg-card p-1.5 rounded-2xl border border-border">
                    {[
                        { id: 'temp_new', label: 'Temperature', icon: Thermometer },
                        { id: 'precipitation_new', label: 'Rain', icon: Droplets },
                        { id: 'wind_new', label: 'Wind', icon: Wind },
                    ].map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setLayer(l.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                layer === l.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted hover:text-white"
                            )}
                        >
                            <l.icon size={16} />
                            {l.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex-1 relative rounded-[2.5rem] overflow-hidden border border-border group">
                <WeatherMap
                    lat={data.lat}
                    lon={data.lon}
                    city={data.city}
                    temp={data.temp}
                    layer={layer}
                    isDarkMode={isDarkMode}
                />

                {/* Floating Info Overlay */}
                <div className="absolute top-6 right-6 p-6 glass-card rounded-3xl border border-white/10 z-10 w-64 backdrop-blur-xl">
                    <h4 className="text-xs uppercase font-black tracking-widest text-muted mb-4">Legend</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">Intensity</span>
                            <div className="w-24 h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded-full" />
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Layers size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted">Active Layer</p>
                                <p className="text-xs font-bold capitalize">{layer.replace('_new', '')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
