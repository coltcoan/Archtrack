import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Mail, Search, Eye } from 'lucide-react';
import { useCustomers } from '@/hooks/use-customers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Customer, TechnologyTypeLabels } from '@/types';
import { formatDate } from '@/lib/utils';
import { useConfig } from '@/contexts/config-context';
import SetupPromptModal from '@/components/setup-prompt-modal';
import SettingsModal from '@/components/settings-modal';
import DemoModePrompt from '@/components/demo-mode-prompt';

export default function CustomerList() {
  const { data: customers, isLoading, error } = useCustomers();
  const { isConfigured, isDemoMode } = useConfig();
  const navigate = useNavigate();
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDemoPrompt, setShowDemoPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState<string>('all');
  const [stakeholderModalCustomer, setStakeholderModalCustomer] = useState<Customer | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (stakeholderModalCustomer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [stakeholderModalCustomer]);

  // Filter customers based on search and technology
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    return customers.filter(customer => {
      const matchesSearch = !searchQuery || 
        customer.crc53_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.crc53_keystakeholders?.some(s => 
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesTech = techFilter === 'all' || 
        customer.crc53_primarytechfocus?.toString() === techFilter;
      
      return matchesSearch && matchesTech;
    });
  }, [customers, searchQuery, techFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">Error loading customers: {error.message}</div>
      </div>
    );
  }

  const handleNewCustomer = (e: React.MouseEvent) => {
    if (isDemoMode) {
      e.preventDefault();
      setShowDemoPrompt(true);
      return;
    }
    if (!isConfigured) {
      e.preventDefault();
      setShowSetupPrompt(true);
    }
  };

  const handleSetup = () => {
    setShowSetupPrompt(false);
    setShowSettings(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-white/80 mt-1">
            Manage your customer records
          </p>
        </div>
        <Link to="/customer/create" onClick={handleNewCustomer}>
          <Button className="bg-gradient-to-r from-[hsl(35,95%,58%)] to-[hsl(35,85%,48%)] hover:from-[hsl(35,95%,52%)] hover:to-[hsl(35,85%,42%)] text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search customers or stakeholders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select 
              value={techFilter} 
              onChange={(e) => setTechFilter(e.target.value)}
              className="w-full sm:w-[200px]"
            >
              <option value="all">All Technologies</option>
              {Object.entries(TechnologyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {!filteredCustomers || filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-muted-foreground">
              {searchQuery || techFilter !== 'all' 
                ? 'No customers match your filters' 
                : 'No customers found'}
            </div>
            {!searchQuery && techFilter === 'all' && (
              <Link to="/customer/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first customer
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card 
              key={customer.crc53_customerid} 
              className="hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
              onClick={() => navigate(`/customer/${customer.crc53_customerid}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{customer.crc53_name}</CardTitle>
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {(!isConfigured || isDemoMode) && (
                      <Badge variant="outline" className="border-orange-300 text-orange-600 bg-orange-50">
                        Sample Data
                      </Badge>
                    )}
                    {customer.crc53_primarytechfocus !== undefined && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        {TechnologyTypeLabels[customer.crc53_primarytechfocus]}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="flex-1">
                  {customer.crc53_keystakeholders && customer.crc53_keystakeholders.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Users className="w-4 h-4" />
                        <span>Key Stakeholders ({customer.crc53_keystakeholders.length})</span>
                      </div>
                      <div className="space-y-2 pl-6">
                        {customer.crc53_keystakeholders.slice(0, 2).map((stakeholder) => (
                          <div key={stakeholder.id} className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground flex-1 min-w-0">
                              <div className="truncate">{stakeholder.name}</div>
                              {stakeholder.role && (
                                <div className="text-xs truncate">{stakeholder.role}</div>
                              )}
                            </div>
                            {stakeholder.email && (
                              <a
                                href={`mailto:${stakeholder.email}`}
                                className="ml-2 p-1 hover:bg-muted rounded transition-colors"
                                title={`Email ${stakeholder.name}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Mail className="w-4 h-4 text-blue-600" />
                              </a>
                            )}
                          </div>
                        ))}
                        {customer.crc53_keystakeholders.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStakeholderModalCustomer(customer);
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            View all {customer.crc53_keystakeholders.length} stakeholders
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customer/${customer.crc53_customerid}`);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created: {formatDate(customer.createdon)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SetupPromptModal
        isOpen={showSetupPrompt}
        onClose={() => setShowSetupPrompt(false)}
        onSetup={handleSetup}
      />
      
      <DemoModePrompt
        isOpen={showDemoPrompt}
        onClose={() => setShowDemoPrompt(false)}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Stakeholder Modal */}
      {stakeholderModalCustomer && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setStakeholderModalCustomer(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)]">
              <div>
                <h2 className="text-xl font-bold text-white">Key Stakeholders</h2>
                <p className="text-white/80 text-sm mt-1">{stakeholderModalCustomer.crc53_name}</p>
              </div>
              <button
                onClick={() => setStakeholderModalCustomer(null)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {stakeholderModalCustomer.crc53_keystakeholders?.map((stakeholder) => (
                  <div key={stakeholder.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg">{stakeholder.name}</div>
                        {stakeholder.role && (
                          <div className="text-sm text-muted-foreground mt-1">{stakeholder.role}</div>
                        )}
                        {stakeholder.email && (
                          <div className="text-sm text-muted-foreground mt-1 break-all">{stakeholder.email}</div>
                        )}
                      </div>
                      {stakeholder.email && (
                        <a
                          href={`mailto:${stakeholder.email}`}
                          className="shrink-0"
                        >
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-muted/30 flex justify-end shrink-0">
              <Button 
                onClick={() => setStakeholderModalCustomer(null)}
                className="bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] hover:from-[hsl(233,85%,52%)] hover:to-[hsl(265,75%,58%)] text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
