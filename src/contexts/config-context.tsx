import { createContext, useContext, useState, useEffect } from 'react';

interface ConfigContextType {
  isConfigured: boolean;
  isDemoMode: boolean;
  solutionArea?: string;
  skillset?: number[];
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // Check if we're on GitHub Pages
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  
  // Get initial demo mode state from localStorage or default to true on GitHub Pages
  const getInitialDemoMode = () => {
    if (!isGitHubPages) return false;
    
    const stored = localStorage.getItem('archtrack-demo-mode');
    if (stored !== null) {
      return stored === 'true';
    }
    return true; // Default to demo mode on GitHub Pages
  };
  
  const getInitialConfigured = () => {
    if (!isGitHubPages) return false;
    
    // On GitHub Pages, configured state matches demo mode
    return getInitialDemoMode();
  };
  
  const [isConfigured, setIsConfigured] = useState<boolean>(getInitialConfigured());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(getInitialDemoMode());
  const [solutionArea, setSolutionArea] = useState<string | undefined>(undefined);
  const [skillset, setSkillset] = useState<number[] | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(!isGitHubPages);

  const refreshConfig = async () => {
    // On GitHub Pages, manage demo mode and configured state via localStorage
    if (isGitHubPages) {
      const storedDemoMode = localStorage.getItem('archtrack-demo-mode');
      const demoMode = storedDemoMode !== null ? storedDemoMode === 'true' : true;
      
      // If demo mode is disabled, treat as not configured (show setup screens)
      setIsConfigured(demoMode);
      setIsDemoMode(demoMode);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/settings/is-configured');
      const data = await response.json();
      setIsConfigured(data.isConfigured);
      setIsDemoMode(data.isDemoMode);
      setSolutionArea(data.solutionArea);
      setSkillset(Array.isArray(data.skillset) ? data.skillset : []);
    } catch (error) {
      console.error('Failed to check configuration:', error);
    }
  };

  useEffect(() => {
    const checkConfig = async () => {
      await refreshConfig();
      setIsChecking(false);
    };
    
    if (!isGitHubPages) {
      checkConfig();
    }
  }, []);

  if (isChecking) {
    return null;
  }

  return (
    <ConfigContext.Provider value={{ isConfigured, isDemoMode, solutionArea, skillset, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
