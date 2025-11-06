import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Settings as SettingsIcon, Sparkles, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProfileSettings from '@/pages/settings/profile';
import ConfigurationSettings from '@/pages/settings/configuration';
import DemoSettings from '@/pages/settings/demo';
import TechnologySettings from '@/pages/settings/technology';

type SettingsTab = 'profile' | 'configuration' | 'technology' | 'demo';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'configuration' as SettingsTab, label: 'Configuration', icon: SettingsIcon },
    { id: 'technology' as SettingsTab, label: 'Technology', icon: Cpu },
    { id: 'demo' as SettingsTab, label: 'Demo', icon: Sparkles },
  ];

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white hover:bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 text-gray-800" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar navigation */}
        <Card className="w-64 h-fit">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white'
                        : 'hover:bg-muted text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'configuration' && <ConfigurationSettings />}
          {activeTab === 'technology' && <TechnologySettings />}
          {activeTab === 'demo' && <DemoSettings />}
        </div>
      </div>
    </div>
  );
}
