import { useState, useRef, useEffect, useMemo } from 'react';
import { X, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/contexts/config-context';
import { SolutionArea, SolutionAreaLabels, SolutionAreaTechnologies, TechnologyTypeLabels } from '@/types';
import ValidationModal from '@/components/validation-modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { isDemoMode, refreshConfig } = useConfig();
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [folderPath, setFolderPath] = useState('');
  const [localDemoMode, setLocalDemoMode] = useState(isDemoMode);
  const [currentDatabasePath, setCurrentDatabasePath] = useState<string>('');
  const [solutionArea, setSolutionArea] = useState<string>('');
  const [skillset, setSkillset] = useState<number[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get available technologies for the selected solution area
  const availableTechnologies = useMemo(() => {
    if (!solutionArea) return [];
    return SolutionAreaTechnologies[solutionArea as SolutionArea] || [];
  }, [solutionArea]);

  // Detect OS and suggest a default path
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const placeholderPath = isMac 
    ? '/Users/yourname/Documents/ProjectTrackerData'
    : 'C:\\Users\\yourname\\Documents\\ProjectTrackerData';

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fetch current database path and preferences when modal opens
  useEffect(() => {
    if (isOpen) {
      // Trigger validation automatically when modal opens
      setShowValidation(true);
      
      fetch('http://localhost:3001/api/settings/is-configured')
        .then(res => res.json())
        .then(data => {
          if (data.databasePath) {
            setCurrentDatabasePath(data.databasePath);
          }
          if (data.solutionArea) {
            setSolutionArea(data.solutionArea);
          }
          if (Array.isArray(data.skillset)) {
            setSkillset(data.skillset);
          }
        })
        .catch(err => console.error('Failed to fetch settings:', err));
    } else {
      // Reset validation state when modal closes
      setShowValidation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImportData = async () => {
    if (!folderPath.trim()) {
      setImportStatus('✗ Please enter a folder path');
      return;
    }

    // Trim quotes from the beginning and end of the path
    let cleanPath = folderPath.trim();
    // Remove leading and trailing single or double quotes
    if ((cleanPath.startsWith("'") && cleanPath.endsWith("'")) || 
        (cleanPath.startsWith('"') && cleanPath.endsWith('"'))) {
      cleanPath = cleanPath.slice(1, -1);
    }

    setIsImporting(true);
    setImportStatus('Validating folder structure...');

    try {
      // Send the folder path to the backend
      const response = await fetch('http://localhost:3001/api/settings/database-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: cleanPath }),
      });

      if (!response.ok) {
        throw new Error('Failed to update database path');
      }

      const result = await response.json();
      
      setImportStatus(`✓ Successfully configured database at: ${result.path}`);
      
      // Refresh the page after 1.5 seconds to load new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('✗ Failed to import data folder. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleBrowse = () => {
    // Trigger the hidden file input for users who want to browse
    fileInputRef.current?.click();
  };

  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // Get the path from the first file
      const firstFile = files[0];
      const fullPath = (firstFile as any).path || firstFile.webkitRelativePath;
      
      // Extract folder path
      let extractedPath = fullPath;
      if (fullPath.includes('/')) {
        const parts = fullPath.split('/');
        parts.pop(); // Remove filename
        extractedPath = parts.join('/');
      }
      
      // Only set if we got an absolute path
      if (extractedPath.startsWith('/') || extractedPath.match(/^[A-Z]:\\/)) {
        setFolderPath(extractedPath);
        setImportStatus('📁 Path detected. Click "Apply" to use this location.');
      } else {
        setImportStatus('⚠ Unable to detect absolute path. Please enter it manually above.');
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      setImportStatus('✗ Error reading folder. Please enter path manually above.');
    }
  };

  const handleResetData = async () => {
    if (!confirm('This will reset the database to the default OneDrive location. Continue?')) {
      return;
    }

    setIsResetting(true);
    setImportStatus('Resetting to default location...');

    try {
      const response = await fetch('http://localhost:3001/api/settings/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset database');
      }

      const result = await response.json();
      setImportStatus(`✓ Reset to default: ${result.path}`);
      
      // Refresh the page after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Reset error:', error);
      setImportStatus('✗ Failed to reset. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDemoModeToggle = async (checked: boolean) => {
    setLocalDemoMode(checked);

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
      
      // Refresh the page to show demo data or real data
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Demo mode toggle error:', error);
      setLocalDemoMode(!checked); // Revert on error
    }
  };

  const handleSolutionAreaChange = async (value: string) => {
    setSolutionArea(value);
    // Clear skillset when changing solution area
    setSkillset([]);

    try {
      const response = await fetch('http://localhost:3001/api/settings/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solutionArea: value, skillset: [] }),
      });

      if (!response.ok) {
        throw new Error('Failed to update solution area');
      }

      await refreshConfig();
    } catch (error) {
      console.error('Solution area update error:', error);
    }
  };

  const handleSkillsetChange = (tech: number) => {
    const newSkillset = skillset.includes(tech)
      ? skillset.filter(t => t !== tech)
      : [...skillset, tech];
    
    setSkillset(newSkillset);
    
    // Debounce the API call
    updateSkillsetInBackground(newSkillset);
  };

  const updateSkillsetInBackground = async (newSkillset: number[]) => {
    try {
      await fetch('http://localhost:3001/api/settings/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skillset: newSkillset }),
      });
      await refreshConfig();
    } catch (error) {
      console.error('Skillset update error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)]">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6">
          {/* Import Data Setting */}
          <div className="space-y-3">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <FolderOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <Label className="text-base font-semibold">
                    Database Location
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the absolute path to your data folder. The app will create "projects" 
                    and "customers" subfolders if they don't exist.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>macOS example:</strong> /Users/yourname/Documents/MyProjectData<br />
                    <strong>Windows example:</strong> C:\Users\yourname\Documents\MyProjectData
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="folderPath" className="text-sm">Folder Path</Label>
                <div className="flex gap-2">
                  <Input
                    id="folderPath"
                    type="text"
                    placeholder={placeholderPath}
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    className="flex-1"
                    disabled={!!currentDatabasePath}
                  />
                  <Button
                    type="button"
                    onClick={handleBrowse}
                    variant="outline"
                    className="shrink-0"
                    disabled={!!currentDatabasePath}
                  >
                    Browse
                  </Button>
                </div>
              </div>

              {importStatus && (
                <p className={`text-sm ${
                  importStatus.startsWith('✓') 
                    ? 'text-green-600' 
                    : importStatus.startsWith('✗')
                    ? 'text-red-600'
                    : importStatus.startsWith('⚠')
                    ? 'text-orange-600'
                    : importStatus.startsWith('📁')
                    ? 'text-blue-600'
                    : 'text-blue-600'
                }`}>
                  {importStatus}
                </p>
              )}

              {currentDatabasePath && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    ℹ️ Database is already configured. Use "Reset Database Location" below to change it.
                  </p>
                </div>
              )}

              <Button
                onClick={handleImportData}
                disabled={isImporting || !folderPath.trim() || !!currentDatabasePath}
                className="w-full bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] hover:from-[hsl(233,85%,52%)] hover:to-[hsl(265,75%,58%)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                {isImporting ? 'Applying...' : 'Apply Database Location'}
              </Button>
              
              {/* Hidden file input for folder selection */}
              <input
                ref={fileInputRef}
                type="file"
                /* @ts-ignore - webkitdirectory is not in the types but works in browsers */
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Demo Mode Setting */}
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-base font-semibold">Demo Mode</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show sample data for demonstrations. Your actual data remains unchanged.
                  </p>
                </div>
                <Switch
                  checked={localDemoMode}
                  onCheckedChange={handleDemoModeToggle}
                  className="ml-4"
                />
              </div>
            </div>
          </div>

          {/* Solution Area Setting */}
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <Label className="text-base font-semibold">Solution Area</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Select your primary Microsoft solution area to get recommended technologies
              </p>
              <select
                value={solutionArea}
                onChange={(e) => handleSolutionAreaChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(233,85%,58%)]"
              >
                <option value="">Select a solution area...</option>
                <option value={SolutionArea.AIBusinessSolutions}>{SolutionAreaLabels[SolutionArea.AIBusinessSolutions]}</option>
                <option value={SolutionArea.CloudAIPlatforms}>{SolutionAreaLabels[SolutionArea.CloudAIPlatforms]}</option>
                <option value={SolutionArea.Security}>{SolutionAreaLabels[SolutionArea.Security]}</option>
              </select>
            </div>
          </div>

          {/* Skillset Setting */}
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <Label className="text-base font-semibold">Skillset / Specialization</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Select the technologies you specialize in from your solution area
              </p>
              {!solutionArea ? (
                <p className="text-sm text-muted-foreground italic">Select a solution area first to choose your skillset</p>
              ) : availableTechnologies.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No technologies available</p>
              ) : (
                <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                  {availableTechnologies.map((tech) => (
                    <label key={tech} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={skillset.includes(tech)}
                        onChange={() => handleSkillsetChange(tech)}
                        className="w-4 h-4 rounded border-gray-300 text-[hsl(233,85%,58%)] focus:ring-[hsl(233,85%,58%)]"
                      />
                      <span className="text-sm">{TechnologyTypeLabels[tech]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reset Data Button */}
          <div className="space-y-3">
            <div className="p-4 border rounded-lg border-orange-200 bg-orange-50">
              <Label className="text-base font-semibold text-orange-900">Reset to Default</Label>
              <p className="text-sm text-orange-700 mt-1 mb-3">
                Reset database location to default OneDrive path. Your data files will not be deleted.
              </p>
              <Button
                onClick={handleResetData}
                disabled={isResetting}
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                {isResetting ? 'Resetting...' : 'Reset Database Location'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30">
          {currentDatabasePath && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <span className="text-green-600 text-lg shrink-0">✅</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-800 mb-1">Configured Data Source</p>
                <code className="text-xs font-mono text-green-700 break-all">{currentDatabasePath}</code>
              </div>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <Button 
              onClick={() => setShowValidation(true)}
              variant="outline"
              className="border-[hsl(233,85%,58%)] text-[hsl(233,85%,58%)] hover:bg-[hsl(233,85%,58%)]/10"
            >
              Load Configuration
            </Button>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] hover:from-[hsl(233,85%,52%)] hover:to-[hsl(265,75%,58%)] text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      <ValidationModal 
        isOpen={showValidation} 
        onClose={() => setShowValidation(false)}
        onComplete={(allPassed) => {
          if (allPassed) {
            refreshConfig();
          }
        }}
      />
    </div>
  );
}
