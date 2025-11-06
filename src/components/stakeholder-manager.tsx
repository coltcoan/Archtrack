import { useState } from 'react';
import { Plus, X, Edit2, Check, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Stakeholder } from '@/types';

interface StakeholderManagerProps {
  stakeholders: Stakeholder[];
  onChange: (stakeholders: Stakeholder[]) => void;
}

export function StakeholderManager({ stakeholders, onChange }: StakeholderManagerProps) {
  const [newStakeholder, setNewStakeholder] = useState({ name: '', role: '', email: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', role: '', email: '' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addStakeholder = () => {
    if (!newStakeholder.name.trim()) return;

    const stakeholder: Stakeholder = {
      id: `temp-${Date.now()}`,
      name: newStakeholder.name,
      role: newStakeholder.role || undefined,
      email: newStakeholder.email || undefined,
    };

    onChange([...stakeholders, stakeholder]);
    setNewStakeholder({ name: '', role: '', email: '' });
  };

  const removeStakeholder = (id: string) => {
    onChange(stakeholders.filter(s => s.id !== id));
  };

  const startEditing = (stakeholder: Stakeholder) => {
    setEditingId(stakeholder.id);
    setEditValues({
      name: stakeholder.name,
      role: stakeholder.role || '',
      email: stakeholder.email || '',
    });
  };

  const saveEdit = (id: string) => {
    const updated = stakeholders.map(s => 
      s.id === id 
        ? { 
            ...s, 
            name: editValues.name,
            role: editValues.role || undefined,
            email: editValues.email || undefined,
          }
        : s
    );
    onChange(updated);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newStakeholders = [...stakeholders];
    const draggedItem = newStakeholders[draggedIndex];
    
    // Remove from old position
    newStakeholders.splice(draggedIndex, 1);
    // Insert at new position
    newStakeholders.splice(index, 0, draggedItem);
    
    onChange(newStakeholders);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {stakeholders.map((stakeholder, index) => (
          <div 
            key={stakeholder.id} 
            draggable={editingId !== stakeholder.id}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-start gap-2 p-3 bg-muted rounded-lg transition-all ${
              editingId !== stakeholder.id ? 'cursor-move hover:bg-muted/80' : ''
            } ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
          >
            <div className="flex items-center pt-2">
              {editingId !== stakeholder.id && (
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            {editingId === stakeholder.id ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  placeholder="Name"
                  className="h-8 text-sm"
                />
                <Input
                  value={editValues.role}
                  onChange={(e) => setEditValues({ ...editValues, role: e.target.value })}
                  placeholder="Role"
                  className="h-8 text-sm"
                />
                <Input
                  value={editValues.email}
                  onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                  placeholder="Email"
                  type="email"
                  className="h-8 text-sm"
                />
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-medium">{stakeholder.name}</p>
                {stakeholder.role && (
                  <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                )}
                {stakeholder.email && (
                  <p className="text-sm text-muted-foreground">{stakeholder.email}</p>
                )}
              </div>
            )}
            
            <div className="flex gap-1">
              {editingId === stakeholder.id ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => saveEdit(stakeholder.id)}
                    title="Save"
                    className="h-8 w-8"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={cancelEdit}
                    title="Cancel"
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(stakeholder)}
                    title="Edit"
                    className="h-8 w-8"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStakeholder(stakeholder.id)}
                    title="Remove"
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 border rounded-lg">
        <h4 className="text-sm font-medium">Add Stakeholder</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="stakeholder-name">Name *</Label>
            <Input
              id="stakeholder-name"
              value={newStakeholder.name}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeholder-role">Role</Label>
            <Input
              id="stakeholder-role"
              value={newStakeholder.role}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
              placeholder="CTO"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeholder-email">Email</Label>
            <Input
              id="stakeholder-email"
              type="email"
              value={newStakeholder.email}
              onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
        </div>
        <Button type="button" onClick={addStakeholder} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Stakeholder
        </Button>
      </div>
    </div>
  );
}
