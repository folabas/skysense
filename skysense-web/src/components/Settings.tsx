"use client"

import React from 'react'
import { Settings as SettingsIcon, Bell, Shield, Smartphone, Globe, Cloud, HelpCircle, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsProps {
    isDarkMode: boolean;
    setIsDarkMode: (dark: boolean) => void;
}

export default function Settings({ isDarkMode, setIsDarkMode }: SettingsProps) {
    const [activeSection, setActiveSection] = React.useState('General')
    const [permission, setPermission] = React.useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    )

    const sections = [
        { name: 'General', icon: Smartphone, desc: 'Units, themes, and basic app behavior.' },
        { name: 'Notifications', icon: Bell, desc: 'Configure severe weather alerts.' },
        { name: 'Privacy', icon: Shield, desc: 'Location access and data tracking.' },
    ]

    const handleNotificationRequest = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === "granted") {
            new Notification("SkySense Alerts Active", {
                body: "You're already set to receive weather updates.",
                icon: "/cloud.png"
            });
            setPermission("granted");
        } else {
            Notification.requestPermission().then((res) => {
                setPermission(res);
                if (res === "granted") {
                    new Notification("SkySense Alerts Enabled!", {
                        body: "Live severe weather updates are now active.",
                        icon: "/cloud.png"
                    });
                }
            });
        }
    }

    return (
        <div className="p-4 md:p-8 text-foreground min-h-screen animate-in fade-in duration-700 transition-colors duration-500">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black mb-2 text-foreground">System Settings</h1>
                <p className="text-muted text-sm md:text-base">Customize your SkySense experience and manage configurations.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="xl:col-span-4 flex flex-row xl:flex-col gap-3 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                    {sections.map((s) => (
                        <button
                            key={s.name}
                            onClick={() => setActiveSection(s.name)}
                            className={cn(
                                "flex-1 xl:flex-none flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all text-left whitespace-nowrap",
                                activeSection === s.name
                                    ? "bg-primary/20 border-primary/30 text-white shadow-lg"
                                    : "bg-card border-border text-muted hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-2 md:p-3 rounded-xl md:rounded-2xl transition-colors",
                                activeSection === s.name ? "bg-primary text-white" : "bg-secondary text-muted"
                            )}>
                                <s.icon size={20} />
                            </div>
                            <div className="hidden sm:block">
                                <h4 className="font-bold text-sm md:text-base text-foreground">{s.name}</h4>
                                <p className="text-[8px] md:text-[10px] uppercase font-black tracking-widest opacity-60">Config</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="xl:col-span-8 glass-card rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                        <div>
                            <h3 className="text-2xl font-black text-foreground">{activeSection}</h3>
                            <p className="text-sm text-muted">Manage your {activeSection.toLowerCase()} settings.</p>
                        </div>
                        <HelpCircle className="text-muted hover:text-foreground cursor-pointer" size={20} />
                    </div>

                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        {activeSection === 'General' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-secondary/20 rounded-3xl border border-border">
                                    <div>
                                        <h5 className="font-bold mb-1 text-foreground">Temperature Unit</h5>
                                        <p className="text-xs text-muted">Choose between Metric and Imperial.</p>
                                    </div>
                                    <div className="flex bg-card p-1 rounded-xl border border-border">
                                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-foreground text-card">Celsius</button>
                                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-muted">Fahrenheit</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-secondary/20 rounded-3xl border border-border">
                                    <div>
                                        <h5 className="font-bold mb-1 text-foreground">Theme Preference</h5>
                                        <p className="text-xs text-muted">Toggle between Dark and Light mode.</p>
                                    </div>
                                    <div className="flex bg-card p-1 rounded-xl border border-border">
                                        <button
                                            onClick={() => setIsDarkMode(true)}
                                            className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", isDarkMode ? "bg-primary text-white shadow-lg" : "text-muted")}
                                        >Dark</button>
                                        <button
                                            onClick={() => setIsDarkMode(false)}
                                            className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", !isDarkMode ? "bg-primary text-white shadow-lg" : "text-muted")}
                                        >Light</button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeSection === 'Notifications' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-2xl",
                                    permission === 'granted' ? "bg-green-500/20 text-green-500 shadow-green-500/20" :
                                        permission === 'denied' ? "bg-red-500/20 text-red-500 shadow-red-500/20" :
                                            "bg-secondary/50 text-muted"
                                )}>
                                    {permission === 'granted' ? <CheckCircle2 size={32} /> :
                                        permission === 'denied' ? <XCircle size={32} /> :
                                            <Bell size={32} />}
                                </div>

                                <h4 className="text-2xl font-black mb-3 text-foreground">
                                    {permission === 'granted' ? "Live Alerts Active" :
                                        permission === 'denied' ? "Alerts Blocked" :
                                            "Severe Weather Alerts"}
                                </h4>

                                <p className="text-muted text-sm max-w-sm leading-relaxed mb-8">
                                    {permission === 'granted' ? "SkySense is currently monitoring Ibadan for critical weather shifts. You will receive active push notifications on your desktop." :
                                        permission === 'denied' ? "Permission was denied. To receive alerts, please reset the notification permission in your browser's address bar settings." :
                                            "Stay ahead of the storm. Enable push notifications to receive real-time alerts for extreme heat, heavy rain, and high wind speeds."}
                                </p>

                                {permission !== 'denied' && (
                                    <button
                                        onClick={handleNotificationRequest}
                                        className={cn(
                                            "px-10 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl",
                                            permission === 'granted'
                                                ? "bg-secondary text-foreground hover:bg-secondary/80 border border-white/5"
                                                : "bg-primary text-white shadow-primary/30 hover:shadow-primary/50"
                                        )}
                                    >
                                        {permission === 'granted' ? "Send Test Alert" : "Enable Notifications"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


