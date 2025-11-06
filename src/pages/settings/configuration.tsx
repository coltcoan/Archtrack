import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderOpen, Download } from 'lucide-react';

export default function ConfigurationSettings() {
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [folderPath, setFolderPath] = useState('');
  const [currentDatabasePath, setCurrentDatabasePath] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect OS and suggest a default path
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const placeholderPath = isMac 
    ? '/Users/yourname/Documents/ProjectTrackerData'
    : 'C:\\Users\\yourname\\Documents\\ProjectTrackerData';

  useEffect(() => {
    fetch('http://localhost:3001/api/settings/is-configured')
      .then(res => res.json())
      .then(data => {
        if (data.databasePath) {
          setCurrentDatabasePath(data.databasePath);
        }
      })
      .catch(err => console.error('Failed to fetch database path:', err));
  }, []);

  const handleImportData = async () => {
    if (!folderPath.trim()) {
      setImportStatus('✗ Please enter a folder path');
      return;
    }

    let cleanPath = folderPath.trim();
    if ((cleanPath.startsWith("'") && cleanPath.endsWith("'")) || 
        (cleanPath.startsWith('"') && cleanPath.endsWith('"'))) {
      cleanPath = cleanPath.slice(1, -1);
    }

    setIsImporting(true);
    setImportStatus('Validating folder structure...');

    try {
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
    fileInputRef.current?.click();
  };

  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const firstFile = files[0];
      const fullPath = (firstFile as any).path || firstFile.webkitRelativePath;
      
      let extractedPath = fullPath;
      if (fullPath.includes('/')) {
        const parts = fullPath.split('/');
        parts.pop();
        extractedPath = parts.join('/');
      }
      
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

  const handleExportProjects = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('http://localhost:3001/api/projects/export', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export projects');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export projects. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {currentDatabasePath && (
        <Card>
          <CardContent className="pt-6">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <span className="text-green-600 text-lg shrink-0">✅</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-800 mb-1">Configured Data Source</p>
                <code className="text-xs font-mono text-green-700 break-all">{currentDatabasePath}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Data Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="folderPath">Database Folder Path</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Enter the absolute path to your data folder (e.g., {placeholderPath})
            </p>
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
                variant="outline" 
                onClick={handleBrowse}
                disabled={!!currentDatabasePath}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Browse
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              // @ts-ignore
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderSelect}
              className="hidden"
            />
          </div>

          <Button 
            onClick={handleImportData}
            disabled={isImporting || !folderPath.trim() || !!currentDatabasePath}
            className="w-full"
          >
            {isImporting ? 'Applying...' : 'Apply Data Source'}
          </Button>

          {importStatus && (
            <div className={`p-3 rounded-lg text-sm ${
              importStatus.startsWith('✓') 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : importStatus.startsWith('✗')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {importStatus}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Export all projects to an Excel spreadsheet
          </p>
          <Button 
            onClick={handleExportProjects}
            disabled={isExporting}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Projects to Excel'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-900">Reset to Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 mb-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
