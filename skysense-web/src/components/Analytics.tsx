"use client"

import React from 'react'
import { PieChart as PieIcon, TrendingUp, Droplets, Wind, Sun, BarChart, LineChart } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart as ReBarChart, Bar, Cell } from 'recharts'
import { useWeather } from '@/hooks/useWeather'

interface AnalyticsProps {
    isDarkMode?: boolean;
}

export default function Analytics({ isDarkMode = true }: AnalyticsProps) {
    const { data } = useWeather()

    if (!data) return null;

    const dataPatterns = [
        { name: 'Humidity', value: data.humidity, icon: Droplets, color: '#3B82F6' },
        { name: 'UV Index', value: data.uvIndex, icon: Sun, color: '#FBBF24' },
        { name: 'Wind', value: data.windSpeed, icon: Wind, color: '#06B6D4' },
    ]

    return (
        <div className="p-4 md:p-8 text-foreground min-h-screen animate-in fade-in duration-700 transition-colors duration-500">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black mb-2">Weather Analytics</h1>
                <p className="text-muted text-sm md:text-base">Deep dive into atmospheric patterns and historical trends.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-8">
                {dataPatterns.map((item) => (
                    <div key={item.name} className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 text-primary">
                                <item.icon size={22} style={{ color: item.color }} />
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted">Real-time Data</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black mb-2">{item.value}{item.name === 'Wind' ? ' km/h' : item.name === 'Humidity' ? '%' : ''}</h3>
                        <p className="text-muted font-bold text-xs md:text-sm">{item.name} Intensity</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 7-Day Temperature Trend */}
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Temperature Variance</h3>
                            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Next 7 Days</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.daily}>
                                <defs>
                                    <linearGradient id="analyticsTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8A4FFF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8A4FFF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDarkMode ? '#15181E' : '#FFFFFF',
                                        border: `1px solid ${isDarkMode ? '#232832' : '#E5E7EB'}`,
                                        borderRadius: '12px'
                                    }}
                                    itemStyle={{ color: isDarkMode ? '#FFFFFF' : '#111827' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={(d) => parseInt(d.temp.split('/')[0])}
                                    stroke="#8A4FFF"
                                    strokeWidth={4}
                                    fill="url(#analyticsTemp)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hourly Probability Bar Chart */}
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Precipitation Risks</h3>
                            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Hourly Probability</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                            <BarChart size={20} />
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={data.hourly}>
                                <XAxis dataKey="time" hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDarkMode ? '#15181E' : '#FFFFFF',
                                        border: `1px solid ${isDarkMode ? '#232832' : '#E5E7EB'}`,
                                        borderRadius: '12px'
                                    }}
                                    cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="precipitation" radius={[10, 10, 0, 0]}>
                                    {data.hourly.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.precipitation > 50 ? '#3B82F6' : (isDarkMode ? '#232832' : '#E5E7EB')} />
                                    ))}
                                </Bar>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
