import { useMemo, useState, useRef, useEffect } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { useCustomers } from '@/hooks/use-customers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TechnologyType, TechnologyTypeLabels, SolutionArea, SolutionAreaTechnologies } from '@/types';
import { TrendingUp, Users, Briefcase, Clock, Cpu, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

// Color mapping for each technology type
const TECH_COLORS: Record<number, {bg: string, border: string, text: string}> = {
  [TechnologyType.M365Copilot]: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' },
  [TechnologyType.CopilotStudio]: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
  [TechnologyType.AzureFoundry]: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-600' },
  [TechnologyType.PowerApps]: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600' },
  [TechnologyType.PowerAutomate]: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-600' },
  [TechnologyType.Governance]: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600' },
  [TechnologyType.Dataverse]: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' },
  [TechnologyType.Other]: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-600' },
};

export default function ReportsPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const [selectedTech, setSelectedTech] = useState<number | null>(null);
  const [techDistributionView, setTechDistributionView] = useState<'projects' | 'customers'>('projects');
  const [solutionArea, setSolutionArea] = useState<SolutionArea | null>(null);
  
  const reportsContentRef = useRef<HTMLDivElement>(null);

  // Fetch solution area settings
  useEffect(() => {
    fetch('http://localhost:3001/api/settings/is-configured')
      .then(res => res.json())
      .then(data => {
        if (data.solutionArea) {
          setSolutionArea(data.solutionArea);
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err));
  }, []);

  const exportFullReport = async () => {
    if (!reportsContentRef.current) return;
    
    try {
      const canvas = await html2canvas(reportsContentRef.current, {
        backgroundColor: '#0f172a', // Match the app background
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `reports-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const metrics = useMemo(() => {
    if (!projects || !customers) return null;

    // Technology distribution by projects
    const projectTechCounts = projects.reduce((acc, project) => {
      const tech = project.crc53_primarytechnology;
      if (tech !== undefined) {
        acc[tech] = (acc[tech] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Technology distribution by customers (based on customer's primary tech focus)
    const customerTechCounts = customers.reduce((acc, customer) => {
      const tech = customer.crc53_primarytechfocus;
      if (tech !== undefined) {
        acc[tech] = (acc[tech] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Filter technologies to show only those in the selected solution area OR that have actual data
    const allowedTechnologies = new Set<number>();
    
    // Add technologies from selected solution area
    if (solutionArea) {
      const solutionTechs = SolutionAreaTechnologies[solutionArea] || [];
      solutionTechs.forEach(tech => allowedTechnologies.add(tech));
    }
    
    // Add technologies that have actual data
    Object.keys(projectTechCounts).forEach(tech => allowedTechnologies.add(Number(tech)));
    Object.keys(customerTechCounts).forEach(tech => allowedTechnologies.add(Number(tech)));

    // Projects by customer
    const projectsByCustomer = projects.reduce((acc, project) => {
      const customerId = project._crc53_customerid_value || 'unassigned';
      acc[customerId] = (acc[customerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Overdue projects
    const now = new Date();
    const overdueProjects = projects.filter((p) => {
      if (!p.crc53_estimatedduedate) return false;
      const dueDate = new Date(p.crc53_estimatedduedate);
      return dueDate < now;
    });

    // Projects with notes
    const projectsWithNotes = projects.filter(p => p.crc53_notes && p.crc53_notes.length > 0);

    return {
      totalProjects: projects.length,
      totalCustomers: customers.length,
      projectTechCounts,
      customerTechCounts,
      projectsByCustomer,
      overdueProjects: overdueProjects.length,
      projectsWithNotes: projectsWithNotes.length,
      customersWithProjects: Object.keys(projectsByCustomer).length - (projectsByCustomer['unassigned'] ? 1 : 0),
      allowedTechnologies,
    };
  }, [projects, customers, solutionArea]);

  if (projectsLoading || customersLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-muted-foreground">Loading reports...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-white/80 mt-1">
            Overview of your project metrics and performance
          </p>
        </div>
        <Button 
          onClick={exportFullReport}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div ref={reportsContentRef} className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all statuses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customersWithProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {metrics.totalCustomers} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects with Notes</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.projectsWithNotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {metrics.totalProjects} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Projects</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics.overdueProjects}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technology Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Technology Distribution
                </CardTitle>
                <CardDescription>
                  {techDistributionView === 'projects' 
                    ? 'Projects by primary technology'
                    : 'Customers by technology usage'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={techDistributionView === 'projects' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTechDistributionView('projects')}
                >
                  Projects
                </Button>
                <Button 
                  variant={techDistributionView === 'customers' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTechDistributionView('customers')}
                >
                  Customers
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(TechnologyTypeLabels)
              .filter(([techValue]) => {
                const techNum = Number(techValue);
                // Only show if in allowed technologies AND has actual usage
                if (!metrics.allowedTechnologies.has(techNum)) return false;
                const techCounts = techDistributionView === 'projects' 
                  ? metrics.projectTechCounts 
                  : metrics.customerTechCounts;
                return (techCounts[techNum] || 0) > 0;
              })
              .map(([techValue, techLabel]) => {
              const techNum = Number(techValue);
              const techCounts = techDistributionView === 'projects' 
                ? metrics.projectTechCounts 
                : metrics.customerTechCounts;
              const count = techCounts[techNum] || 0;
              const total = techDistributionView === 'projects' ? metrics.totalProjects : metrics.totalCustomers;
              const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
              const colors = TECH_COLORS[techNum] || { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-600' };
              const isSelected = selectedTech === techNum;
              const isAnySelected = selectedTech !== null;

              return (
                <div key={techValue} style={{ marginBottom: '20px', width: '100%', maxWidth: '100%' }}>
                  <div 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      width: '100%'
                    }}
                  >
                    <span 
                      className={`${colors.bg} text-white`}
                      style={{ 
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        flexShrink: 0
                      }}
                    >
                      {techLabel}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap',
                        marginLeft: '16px',
                        flexShrink: 0
                      }}
                    >
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div 
                    className={`cursor-pointer ${
                      isAnySelected && !isSelected ? 'opacity-40' : 'opacity-100'
                    }`}
                    onClick={() => setSelectedTech(isSelected ? null : techNum)}
                    style={{ 
                      width: '100%', 
                      height: '12px', 
                      borderRadius: '9999px', 
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                      display: 'block',
                      clear: 'both'
                    }}
                  >
                    <div
                      className={`${colors.bg}`}
                      style={{ 
                        width: `${percentage}%`, 
                        height: '12px',
                        borderRadius: '9999px',
                        display: 'block',
                        float: 'left'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {selectedTech !== null && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Filtering other reports by: <span className="font-medium text-foreground">{TechnologyTypeLabels[selectedTech as TechnologyType]}</span>
                  {' '}
                  <button 
                    onClick={() => setSelectedTech(null)}
                    className="text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Customers by Project Count</CardTitle>
                <CardDescription>Customers with the most projects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers &&
                customers
                  .map((customer) => ({
                    customer,
                    projectCount: metrics.projectsByCustomer[customer.crc53_customerid] || 0,
                  }))
                  .filter((item) => item.projectCount > 0)
                  .sort((a, b) => b.projectCount - a.projectCount)
                  .slice(0, 5)
                  .map(({ customer, projectCount }) => (
                    <div
                      key={customer.crc53_customerid}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <div className="font-medium">{customer.crc53_name}</div>
                        {customer.crc53_primarytechfocus !== undefined && (
                          <div className="text-sm text-muted-foreground">
                            {TechnologyTypeLabels[customer.crc53_primarytechfocus]}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">{projectCount} projects</Badge>
                    </div>
                  ))}
              {(!customers || customers.filter((c) => metrics.projectsByCustomer[c.crc53_customerid]).length === 0) && (
                <div className="text-center text-muted-foreground py-4">
                  No customers with projects yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
