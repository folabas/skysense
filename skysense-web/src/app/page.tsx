"use client"

import React from 'react'
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import FullMap from "@/components/FullMap";
import Schedule from "@/components/Schedule";
import Settings from "@/components/Settings";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('Dashboard')
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard isDarkMode={isDarkMode} />
      case 'Analytics': return <Analytics />
      case 'Map': return <FullMap isDarkMode={isDarkMode} />
      case 'Schedule': return <Schedule />
      case 'Settings': return <Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      default: return <Dashboard isDarkMode={isDarkMode} />
    }
  }

  return (
    <div className="flex bg-background min-h-screen font-sans selection:bg-primary/30 text-foreground transition-colors duration-500">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      {renderContent()}
    </div>
  );
}
