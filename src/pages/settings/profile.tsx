import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SolutionArea, SolutionAreaLabels, SolutionAreaTechnologies, TechnologyTypeLabels } from '@/types';
import { useConfig } from '@/contexts/config-context';
import ValidationModal from '@/components/validation-modal';

export default function ProfileSettings() {
  const { solutionArea: currentSolutionArea, skillset: currentSkillset, refreshConfig } = useConfig();
  const [solutionArea, setSolutionArea] = useState<string>('');
  const [skillset, setSkillset] = useState<number[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  // Get available technologies for the selected solution area
  const availableTechnologies = useMemo(() => {
    if (!solutionArea) return [];
    return SolutionAreaTechnologies[solutionArea as SolutionArea] || [];
  }, [solutionArea]);

  useEffect(() => {
    setSolutionArea(currentSolutionArea || '');
    setSkillset(currentSkillset || []);
  }, [currentSolutionArea, currentSkillset]);

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Area</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Select your primary Microsoft solution area. This will determine which technologies appear in your forms.
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skillset / Specialization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Select the technologies you specialize in from your solution area
          </p>
          {!solutionArea ? (
            <p className="text-sm text-muted-foreground italic">Select a solution area first to choose your skillset</p>
          ) : availableTechnologies.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No technologies available</p>
          ) : (
            <div className="max-h-96 overflow-y-auto border rounded-md p-3 space-y-2">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Load Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Validate your data source, solution areas, and records are properly loaded.
          </p>
          <Button
            onClick={() => setShowValidation(true)}
            className="w-full bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] hover:from-[hsl(233,85%,52%)] hover:to-[hsl(265,75%,58%)] text-white"
          >
            Load Configuration
          </Button>
        </CardContent>
      </Card>

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
