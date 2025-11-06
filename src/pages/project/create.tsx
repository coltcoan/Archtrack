import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreateProject } from '@/hooks/use-projects';
import { useCustomers } from '@/hooks/use-customers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { TechnologyType, ProjectStatus, ProjectStatusLabels } from '@/types';
import { useSetupPrompt } from '@/hooks/use-setup-prompt';
import SetupPromptModal from '@/components/setup-prompt-modal';
import SettingsModal from '@/components/settings-modal';
import { useConfig } from '@/contexts/config-context';
import { TechnologySelect } from '@/components/technology-select';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const { data: customers } = useCustomers();
  const { showSetupPrompt, setShowSetupPrompt, showSettings, setShowSettings, checkConfigured, handleSetup } = useSetupPrompt();
  const { solutionArea } = useConfig();

  const [formData, setFormData] = useState({
    crc53_name: '',
    crc53_primarystakeholder: '',
    crc53_description: '',
    crc53_estimatedduedate: '',
    crc53_primarytechnology: TechnologyType.Other,
    crc53_status: ProjectStatus.Backlog,
    crc53_estimatedusage: '',
    crc53_hasintent: false,
    crc53_hasbuyin: false,
    customerId: '',
  });

  const [availableStakeholders, setAvailableStakeholders] = useState<string[]>([]);

  const handleCustomerChange = (customerId: string) => {
    setFormData({ ...formData, customerId, crc53_primarystakeholder: '' });
    
    if (customerId) {
      const customer = customers?.find(c => c.crc53_customerid === customerId);
      if (customer?.crc53_keystakeholders) {
        setAvailableStakeholders(customer.crc53_keystakeholders.map(s => s.name));
      } else {
        setAvailableStakeholders([]);
      }
    } else {
      setAvailableStakeholders([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkConfigured()) {
      return;
    }

    const projectData: any = {
      crc53_name: formData.crc53_name,
      crc53_primarystakeholder: formData.crc53_primarystakeholder || undefined,
      crc53_description: formData.crc53_description || undefined,
      crc53_estimatedduedate: formData.crc53_estimatedduedate || undefined,
      crc53_primarytechnology: formData.crc53_primarytechnology,
      crc53_status: formData.crc53_status,
      crc53_estimatedusage: formData.crc53_estimatedusage || undefined,
      crc53_hasintent: formData.crc53_hasintent,
      crc53_hasbuyin: formData.crc53_hasbuyin,
      crc53_notes: [],
    };

    if (formData.customerId) {
      projectData['crc53_customerid@odata.bind'] = `/crc53_customers(${formData.customerId})`;
    }

    try {
      await createProject.mutateAsync(projectData);
      navigate('/');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Create New Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                required
                value={formData.crc53_name}
                onChange={(e) =>
                  setFormData({ ...formData, crc53_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.crc53_description}
                onChange={(e) =>
                  setFormData({ ...formData, crc53_description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select
                  id="customer"
                  required
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                >
                  <option value="">Select a customer</option>
                  {customers?.map((customer) => (
                    <option
                      key={customer.crc53_customerid}
                      value={customer.crc53_customerid}
                    >
                      {customer.crc53_name}
                    </option>
                  ))}
                </Select>
              </div>

              {availableStakeholders.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="stakeholder">Primary Stakeholder</Label>
                  <Select
                    id="stakeholder"
                    value={formData.crc53_primarystakeholder}
                    onChange={(e) =>
                      setFormData({ ...formData, crc53_primarystakeholder: e.target.value })
                    }
                  >
                    <option value="">Select a stakeholder</option>
                    {availableStakeholders.map((stakeholder) => (
                      <option key={stakeholder} value={stakeholder}>
                        {stakeholder}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="duedate">Estimated Due Date</Label>
                <Input
                  id="duedate"
                  type="date"
                  value={formData.crc53_estimatedduedate}
                  onChange={(e) =>
                    setFormData({ ...formData, crc53_estimatedduedate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  id="status"
                  required
                  value={formData.crc53_status.toString()}
                  onChange={(e) =>
                    setFormData({ ...formData, crc53_status: Number(e.target.value) as ProjectStatus })
                  }
                >
                  {Object.entries(ProjectStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <TechnologySelect
                id="technology"
                label="Primary Technology"
                value={formData.crc53_primarytechnology}
                onChange={(tech) => 
                  setFormData({
                    ...formData,
                    crc53_primarytechnology: tech,
                  })
                }
                solutionArea={solutionArea}
              />

              <div className="space-y-2">
                <Label htmlFor="estimatedusage">Estimated Usage</Label>
                <Input
                  id="estimatedusage"
                  type="text"
                  value={formData.crc53_estimatedusage}
                  onChange={(e) =>
                    setFormData({ ...formData, crc53_estimatedusage: e.target.value })
                  }
                  placeholder="e.g., 100 users, 1000 transactions/month"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasintent"
                    checked={formData.crc53_hasintent}
                    onChange={(e) =>
                      setFormData({ ...formData, crc53_hasintent: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="hasintent" className="cursor-pointer">Is there intent?</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasbuyin"
                    checked={formData.crc53_hasbuyin}
                    onChange={(e) =>
                      setFormData({ ...formData, crc53_hasbuyin: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="hasbuyin" className="cursor-pointer">Do we have buy-in?</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Link to="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <SetupPromptModal
        isOpen={showSetupPrompt}
        onClose={() => setShowSetupPrompt(false)}
        onSetup={handleSetup}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
