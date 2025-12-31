"use client"

import React from 'react'
import { LayoutDashboard, PieChart, Map as MapIcon, Calendar, Settings, Cloud, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: PieChart, label: 'Analytics', active: false },
    { icon: MapIcon, label: 'Map', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
    { icon: Settings, label: 'Settings', active: false },
]

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (dark: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: SidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-20 lg:w-24 h-screen fixed left-0 top-0 bg-card border-r border-border flex-col items-center py-8 z-50 transition-colors duration-500">
                <div className="mb-12">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                        <Cloud size={28} />
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={cn(
                                "p-3 rounded-2xl transition-all duration-300 group relative",
                                activeTab === item.label
                                    ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(138,79,255,0.2)]"
                                    : "text-muted hover:text-white dark:hover:text-white hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            <item.icon size={24} />
                            {activeTab === item.label && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col items-center gap-6">
                    <div
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-10 h-16 bg-secondary/50 rounded-full border border-border p-1 flex flex-col items-center justify-between cursor-pointer group"
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                            !isDarkMode ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted group-hover:text-white"
                        )}>
                            <Sun size={14} />
                        </div>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                            isDarkMode ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted group-hover:text-white"
                        )}>
                            <Cloud size={14} />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-4 z-50 transition-colors duration-500">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setActiveTab(item.label)}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                            activeTab === item.label ? "text-primary scale-110" : "text-muted"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex flex-col items-center gap-1 p-2 text-muted"
                >
                    {isDarkMode ? <Sun size={20} /> : <Cloud size={20} />}
                    <span className="text-[10px] font-bold">Mode</span>
                </button>
            </nav>
        </>
    )
}
