import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StakeholderManager } from '@/components/stakeholder-manager';
import { TechnologyType, Stakeholder } from '@/types';
import { useConfig } from '@/contexts/config-context';
import { TechnologySelect } from '@/components/technology-select';

export default function CustomerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id!);
  const updateCustomer = useUpdateCustomer();
  const { solutionArea } = useConfig();

  const [formData, setFormData] = useState({
    crc53_name: '',
    crc53_keystakeholders: [] as Stakeholder[],
    crc53_primarytechfocus: TechnologyType.Other,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        crc53_name: customer.crc53_name || '',
        crc53_keystakeholders: customer.crc53_keystakeholders || [],
        crc53_primarytechfocus: customer.crc53_primarytechfocus || TechnologyType.Other,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData: any = {
      crc53_name: formData.crc53_name,
      crc53_keystakeholders: formData.crc53_keystakeholders,
      crc53_primarytechfocus: formData.crc53_primarytechfocus,
    };

    try {
      await updateCustomer.mutateAsync({ id: id!, data: customerData });
      navigate(`/customer/${id}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-muted-foreground">Loading customer...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-destructive">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/customer/${id}`}>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white hover:bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 text-gray-800" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Edit Customer</h1>
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
              <Link to={`/customer/${id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={updateCustomer.isPending}>
                {updateCustomer.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
