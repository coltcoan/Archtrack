import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreateCustomer } from '@/hooks/use-customers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StakeholderManager } from '@/components/stakeholder-manager';
import { TechnologyType, Stakeholder } from '@/types';
import { useSetupPrompt } from '@/hooks/use-setup-prompt';
import SetupPromptModal from '@/components/setup-prompt-modal';
import SettingsModal from '@/components/settings-modal';
import { useConfig } from '@/contexts/config-context';
import { TechnologySelect } from '@/components/technology-select';

export default function CustomerCreate() {
  const navigate = useNavigate();
  const createCustomer = useCreateCustomer();
  const { showSetupPrompt, setShowSetupPrompt, showSettings, setShowSettings, checkConfigured, handleSetup } = useSetupPrompt();
  const { solutionArea } = useConfig();

  const [formData, setFormData] = useState({
    crc53_name: '',
    crc53_keystakeholders: [] as Stakeholder[],
    crc53_primarytechfocus: TechnologyType.Other,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkConfigured()) {
      return;
    }

    const customerData: any = {
      crc53_name: formData.crc53_name,
      crc53_keystakeholders: formData.crc53_keystakeholders,
      crc53_primarytechfocus: formData.crc53_primarytechfocus,
    };

    try {
      await createCustomer.mutateAsync(customerData);
      navigate('/customer');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/customer">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Create New Customer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                required
                value={formData.crc53_name}
                onChange={(e) =>
                  setFormData({ ...formData, crc53_name: e.target.value })
                }
              />
            </div>

            <TechnologySelect
              id="techfocus"
              label="Primary Tech Focus"
              value={formData.crc53_primarytechfocus}
              onChange={(tech) => 
                setFormData({
                  ...formData,
                  crc53_primarytechfocus: tech,
                })
              }
              solutionArea={solutionArea}
            />

            <div className="space-y-2">
              <Label>Key Stakeholders</Label>
              <StakeholderManager
                stakeholders={formData.crc53_keystakeholders}
                onChange={(stakeholders) =>
                  setFormData({ ...formData, crc53_keystakeholders: stakeholders })
                }
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Link to="/customer">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={createCustomer.isPending}>
                {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
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
