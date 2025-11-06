import { useState } from 'react';
import { useConfig } from '@/contexts/config-context';

export function useSetupPrompt() {
  const { isConfigured, isDemoMode } = useConfig();
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDemoPrompt, setShowDemoPrompt] = useState(false);

  const checkConfigured = (callback?: () => void) => {
    if (isDemoMode) {
      setShowDemoPrompt(true);
      return false;
    }
    if (!isConfigured) {
      setShowSetupPrompt(true);
      return false;
    }
    callback?.();
    return true;
  };

  const handleSetup = () => {
    setShowSetupPrompt(false);
    setShowSettings(true);
  };

  const handleDemoPromptClose = () => {
    setShowDemoPrompt(false);
  };

  return {
    isConfigured,
    isDemoMode,
    showSetupPrompt,
    setShowSetupPrompt,
    showSettings,
    setShowSettings,
    showDemoPrompt,
    setShowDemoPrompt,
    checkConfigured,
    handleSetup,
    handleDemoPromptClose,
  };
}
