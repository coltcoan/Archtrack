import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  SolutionAreaLabels, 
  SolutionAreaTechnologies,
  TechnologyTypeLabels 
} from '@/types';
import { Download, Upload, Plus, Trash2, Pencil, X, FolderPlus, Save } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface TechnologyItem {
  id: number;
  label: string;
  solutionArea: string;
}

interface SolutionAreaItem {
  id: string;
  label: string;
}

export default function TechnologySettings() {
  const [editingTech, setEditingTech] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [newTech, setNewTech] = useState({ label: '', solutionArea: '' });
  const [newArea, setNewArea] = useState({ id: '', label: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'tech' | 'area', id: string | number } | null>(null);
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [editAreaLabel, setEditAreaLabel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize solution areas
  const [solutionAreas, setSolutionAreas] = useState<SolutionAreaItem[]>(
    Object.entries(SolutionAreaLabels).map(([id, label]) => ({ id, label }))
  );

  // Get all technologies organized by solution area
  const getTechnologiesBySolutionArea = () => {
    const result: Record<string, TechnologyItem[]> = {};

    // Initialize with current solution areas
    solutionAreas.forEach(area => {
      result[area.id] = [];
    });

    Object.entries(SolutionAreaTechnologies).forEach(([area, techs]) => {
      if (!result[area]) {
        result[area] = [];
      }
      result[area] = techs.map(techId => ({
        id: techId,
        label: TechnologyTypeLabels[techId],
        solutionArea: area,
      }));
    });

    return result;
  };

  const [technologies, setTechnologies] = useState(getTechnologiesBySolutionArea());

  // Load settings from server
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/settings/technology');
        const data = await response.json();
        
        if (data.solutionAreas && data.solutionAreas.length > 0) {
          setSolutionAreas(data.solutionAreas);
          setTechnologies(data.technologies || {});
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load technology settings:', error);
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings to server
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:3001/api/settings/technology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solutionAreas,
          technologies
        })
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      toast.success('Technology settings saved successfully');
    } catch (error) {
      console.error('Failed to save technology settings:', error);
      toast.error('Failed to save technology settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Technology handlers
  const handleEditTech = (techId: number) => {
    setEditingTech(techId);
    setEditLabel(TechnologyTypeLabels[techId as keyof typeof TechnologyTypeLabels] || '');
  };

  const handleSaveTechEdit = () => {
    if (!editingTech) return;
    
    const updatedTechs = { ...technologies };
    Object.keys(updatedTechs).forEach(area => {
      updatedTechs[area] = updatedTechs[area].map(t => 
        t.id === editingTech ? { ...t, label: editLabel } : t
      );
    });
    setTechnologies(updatedTechs);
    setEditingTech(null);
    saveSettings();
  };

  const handleDeleteTech = (techId: number) => {
    const updatedTechs = { ...technologies };
    Object.keys(updatedTechs).forEach(area => {
      updatedTechs[area] = updatedTechs[area].filter(t => t.id !== techId);
    });
    setTechnologies(updatedTechs);
    setShowDeleteConfirm(null);
    saveSettings();
  };

  const handleAddTech = () => {
    if (!newTech.label || !newTech.solutionArea) return;
    
    const newTechId = Date.now(); // Generate unique ID
    const updatedTechs = { ...technologies };
    
    if (!updatedTechs[newTech.solutionArea]) {
      updatedTechs[newTech.solutionArea] = [];
    }
    
    updatedTechs[newTech.solutionArea].push({
      id: newTechId,
      label: newTech.label,
      solutionArea: newTech.solutionArea
    });
    
    setTechnologies(updatedTechs);
    setShowAddTechModal(false);
    setNewTech({ label: '', solutionArea: solutionAreas[0]?.id || '' });
    saveSettings();
  };

  // Solution Area handlers
  const handleEditArea = (areaId: string) => {
    setEditingArea(areaId);
    const area = solutionAreas.find(a => a.id === areaId);
    setEditAreaLabel(area?.label || '');
  };

  const handleSaveAreaEdit = () => {
    if (!editingArea) return;
    
    setSolutionAreas(prev => 
      prev.map(area => 
        area.id === editingArea ? { ...area, label: editAreaLabel } : area
      )
    );
    setEditingArea(null);
    saveSettings();
  };

  const handleDeleteArea = (areaId: string) => {
    // Remove the solution area
    setSolutionAreas(prev => prev.filter(area => area.id !== areaId));
    // Remove all technologies in that area
    const updatedTechs = { ...technologies };
    delete updatedTechs[areaId];
    setTechnologies(updatedTechs);
    setShowDeleteConfirm(null);
    saveSettings();
  };

  const handleAddArea = () => {
    if (!newArea.id || !newArea.label) {
      toast.error('Please fill in both ID and Label');
      return;
    }

    if (solutionAreas.some(area => area.id === newArea.id)) {
      toast.error('Solution Area ID already exists');
      return;
    }

    setSolutionAreas(prev => [...prev, { id: newArea.id, label: newArea.label }]);
    setTechnologies(prev => ({ ...prev, [newArea.id]: [] }));
    setShowAddAreaModal(false);
    setNewArea({ id: '', label: '' });
    saveSettings();
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Solution Area ID': 'ai-business',
        'Solution Area Name': 'AI Business Solutions',
        'Technology Name': 'Example Technology 1',
      },
      {
        'Solution Area ID': 'cloud-ai',
        'Solution Area Name': 'Cloud & AI Platforms',
        'Technology Name': 'Example Technology 2',
      },
      {
        'Solution Area ID': 'security',
        'Solution Area Name': 'Security',
        'Technology Name': 'Example Technology 3',
      },
      {
        'Solution Area ID': 'custom-area',
        'Solution Area Name': 'My Custom Area',
        'Technology Name': '',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Technologies');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Solution Area ID
      { wch: 30 }, // Solution Area Name
      { wch: 40 }, // Technology Name
    ];

    XLSX.writeFile(workbook, 'technology-import-template.xlsx');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as any[];

      const newAreas: Set<string> = new Set();
      const areaLabels: Record<string, string> = {};
      const newTechs: Record<string, TechnologyItem[]> = {};

      json.forEach((row, index) => {
        const areaId = row['Solution Area ID'];
        const areaName = row['Solution Area Name'];
        const techName = row['Technology Name'];

        if (!areaId || !areaName) {
          console.warn(`Row ${index + 1} missing required Solution Area information`);
          return;
        }

        // Track solution areas
        newAreas.add(areaId);
        areaLabels[areaId] = areaName;

        // Add technology if provided
        if (techName) {
          if (!newTechs[areaId]) {
            newTechs[areaId] = [];
          }
          newTechs[areaId].push({
            id: Date.now() + index, // Generate a temporary ID
            label: techName,
            solutionArea: areaId,
          });
        }
      });

      console.log('Imported solution areas:', Array.from(newAreas));
      console.log('Imported technologies:', newTechs);
      
      // Update state with imported data
      setSolutionAreas(Array.from(newAreas).map(id => ({ id, label: areaLabels[id] })));
      setTechnologies(newTechs);
      
      // Save to backend
      saveSettings();
      
      toast.success(`Imported ${newAreas.size} solution areas and ${Object.values(newTechs).flat().length} technologies`);
    };
    reader.readAsBinaryString(file);
    event.target.value = ''; // Reset input
  };

  const exportTechnologies = () => {
    const exportData: any[] = [];
    
    solutionAreas.forEach(area => {
      const areaTechs = technologies[area.id] || [];
      
      if (areaTechs.length === 0) {
        // Export solution area even if it has no technologies
        exportData.push({
          'Solution Area ID': area.id,
          'Solution Area Name': area.label,
          'Technology Name': '',
        });
      } else {
        areaTechs.forEach(tech => {
          exportData.push({
            'Solution Area ID': area.id,
            'Solution Area Name': area.label,
            'Technology Name': tech.label,
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Technologies');

    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 40 },
    ];

    XLSX.writeFile(workbook, `technologies-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading technology settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={saveSettings} 
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
            <Button onClick={() => setShowAddAreaModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Solution Area
            </Button>
            <Button onClick={() => {
              if (solutionAreas.length === 0) {
                toast.error('Please add a solution area first');
                return;
              }
              setNewTech({ label: '', solutionArea: solutionAreas[0].id });
              setShowAddTechModal(true);
            }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button onClick={exportTechnologies} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import from Excel
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Solution Areas with Technologies */}
      {solutionAreas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">No solution areas found</div>
            <Button onClick={() => setShowAddAreaModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Your First Solution Area
            </Button>
          </CardContent>
        </Card>
      ) : (
        solutionAreas.map((area) => {
          const areaTechs = technologies[area.id] || [];
          
          return (
            <Card key={area.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  {editingArea === area.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editAreaLabel}
                        onChange={(e) => setEditAreaLabel(e.target.value)}
                        className="max-w-md"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveAreaEdit}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingArea(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <CardTitle>{area.label}</CardTitle>
                        <CardDescription>
                          ID: {area.id} • {areaTechs.length} {areaTechs.length === 1 ? 'technology' : 'technologies'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditArea(area.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setShowDeleteConfirm({ type: 'area', id: area.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {areaTechs.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 border rounded-lg">
                      No technologies in this solution area
                    </div>
                  ) : (
                    areaTechs.map(tech => (
                      <div
                        key={tech.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {editingTech === tech.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="flex-1"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveTechEdit}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingTech(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="font-medium">{tech.label}</div>
                              <div className="text-xs text-muted-foreground">ID: {tech.id}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTech(tech.id)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm({ type: 'tech', id: tech.id })}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Add Solution Area Modal */}
      {showAddAreaModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddAreaModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Add New Solution Area</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="areaId">Solution Area ID</Label>
                <Input
                  id="areaId"
                  value={newArea.id}
                  onChange={(e) => setNewArea({ ...newArea, id: e.target.value })}
                  placeholder="e.g., custom-solutions"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use lowercase with hyphens (e.g., ai-business, cloud-ai)
                </p>
              </div>
              <div>
                <Label htmlFor="areaLabel">Display Name</Label>
                <Input
                  id="areaLabel"
                  value={newArea.label}
                  onChange={(e) => setNewArea({ ...newArea, label: e.target.value })}
                  placeholder="e.g., Custom Solutions"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowAddAreaModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddArea} 
                  disabled={!newArea.id || !newArea.label}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Solution Area
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Technology Modal */}
      {showAddTechModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddTechModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Add New Technology</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="techName">Technology Name</Label>
                <Input
                  id="techName"
                  value={newTech.label}
                  onChange={(e) => setNewTech({ ...newTech, label: e.target.value })}
                  placeholder="Enter technology name"
                />
              </div>
              <div>
                <Label htmlFor="solutionArea">Solution Area</Label>
                <select
                  id="solutionArea"
                  value={newTech.solutionArea}
                  onChange={(e) => setNewTech({ ...newTech, solutionArea: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {solutionAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowAddTechModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddTech} 
                  disabled={!newTech.label}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Technology
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              {showDeleteConfirm.type === 'area' 
                ? 'Are you sure you want to delete this solution area? All associated technologies will also be deleted. This action cannot be undone.'
                : 'Are you sure you want to delete this technology? This action cannot be undone.'
              }
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (showDeleteConfirm.type === 'tech') {
                    handleDeleteTech(showDeleteConfirm.id as number);
                  } else {
                    handleDeleteArea(showDeleteConfirm.id as string);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
