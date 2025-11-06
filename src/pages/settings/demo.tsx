import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/contexts/config-context';

export default function DemoSettings() {
  const { isDemoMode, refreshConfig } = useConfig();
  const [localDemoMode, setLocalDemoMode] = useState(isDemoMode);
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

  useEffect(() => {
    setLocalDemoMode(isDemoMode);
  }, [isDemoMode]);

  const handleDemoModeToggle = async (checked: boolean) => {
    setLocalDemoMode(checked);

    // On GitHub Pages, save to localStorage
    if (isGitHubPages) {
      localStorage.setItem('archtrack-demo-mode', checked.toString());
      await refreshConfig();
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }
    
    // On local deployment, call backend API
    try {
      const response = await fetch('http://localhost:3001/api/settings/demo-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: checked }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle demo mode');
      }

      await refreshConfig();
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Demo mode toggle error:', error);
      setLocalDemoMode(!checked);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              {isGitHubPages 
                ? 'Toggle demo mode to switch between sample data and an empty workspace. Demo mode is enabled by default on this deployment.'
                : 'Show sample data for demonstrations and testing. Your actual data remains unchanged and will be restored when demo mode is disabled.'
              }
            </p>
            {!isGitHubPages && (
              <>
                <p className="text-xs text-muted-foreground">
                  Demo mode is useful for:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside mt-1 space-y-1">
                  <li>Testing features without affecting real data</li>
                  <li>Creating screenshots for documentation</li>
                  <li>Demonstrating the application to others</li>
                </ul>
              </>
            )}
          </div>
          <Switch
            checked={localDemoMode}
            onCheckedChange={handleDemoModeToggle}
          />
        </div>
        
        {localDemoMode && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode Active:</strong> {isGitHubPages 
                ? 'This is a demo deployment with sample data.' 
                : 'You are currently viewing sample data. Toggle off to return to your real data.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
