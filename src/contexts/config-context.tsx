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
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [solutionArea, setSolutionArea] = useState<string | undefined>(undefined);
  const [skillset, setSkillset] = useState<number[] | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(true);

  const refreshConfig = async () => {
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
    checkConfig();
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
