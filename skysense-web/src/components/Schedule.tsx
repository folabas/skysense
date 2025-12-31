"use client"

import React from 'react'
import { Calendar, Clock, CheckCircle2, AlertCircle, Coffee, Dumbbell, Car, Palmtree } from 'lucide-react'
import { useWeather } from '@/hooks/useWeather'
import { cn } from '@/lib/utils'

export default function Schedule() {
    const { data } = useWeather()

    if (!data) return null

    const activities = [
        { name: 'Outdoor Workout', icon: Dumbbell, metric: data.temp, ideal: '15-25°C', status: data.temp > 15 && data.temp < 28 ? 'Ideal' : 'Poor' },
        { name: 'Car Wash', icon: Car, metric: data.chanceOfRain, ideal: '<20%', status: data.chanceOfRain < 20 ? 'Perfect' : 'Avoid' },
        { name: 'Coffee Break', icon: Coffee, metric: data.condition, ideal: 'Cloudy/Clear', status: (data.condition === 'Clear' || data.condition === 'Clouds') ? 'Great' : 'Cozy' },
        { name: 'Beach Day', icon: Palmtree, metric: data.uvIndex, ideal: 'Low UV', status: data.uvIndex < 5 ? 'Safe' : 'Use SPF' },
    ]

    return (
        <div className="p-4 md:p-8 text-foreground min-h-screen animate-in fade-in duration-700 transition-colors duration-500">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black mb-2">Smart Scheduler</h1>
                <p className="text-muted text-sm md:text-base">Personalized activity planning based on the upcoming weather forecast.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Daily Plan */}
                <div className="glass-card rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Planned Activities</h3>
                    </div>

                    <div className="space-y-4">
                        {activities.map((act) => (
                            <div key={act.name} className="flex items-center justify-between p-6 bg-secondary/30 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                        <act.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{act.name}</h4>
                                        <p className="text-[10px] text-muted uppercase font-black tracking-widest">Ideal: {act.ideal}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-bold border",
                                    act.status === 'Ideal' || act.status === 'Perfect' || act.status === 'Great'
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                )}>
                                    {act.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Times Hook */}
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Hourly Recommendations</h3>
                    </div>

                    <div className="flex-1 space-y-3">
                        {data.hourly.slice(0, 8).map((hour, i) => {
                            const isGood = hour.precipitation < 30 && hour.temp > 10;
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/30">
                                    <span className="text-xs font-black min-w-[50px]">{hour.time}</span>
                                    <div className={cn("w-2 h-2 rounded-full", isGood ? "bg-green-500" : "bg-red-500")} />
                                    <p className="text-sm font-medium flex-1">
                                        {isGood ? 'Perfect for outdoor plans' : 'Stay indoors, rain or cold expected'}
                                    </p>
                                    {isGood ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-500" />}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
