import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, TrendingUp, Building2, Clock } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus, ProjectStatusLabels, ProjectStatusColors, TechnologyTypeLabels } from '@/types';
import { formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects();

  const dashboardData = useMemo(() => {
    if (!projects) return null;

    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    // Projects due in timeframes
    const dueNext7Days = projects.filter(p => {
      if (!p.crc53_estimatedduedate) return false;
      const dueDate = new Date(p.crc53_estimatedduedate);
      return dueDate >= now && dueDate <= sevenDays;
    });

    const dueNext30Days = projects.filter(p => {
      if (!p.crc53_estimatedduedate) return false;
      const dueDate = new Date(p.crc53_estimatedduedate);
      return dueDate >= now && dueDate <= thirtyDays;
    });

    const dueNext60Days = projects.filter(p => {
      if (!p.crc53_estimatedduedate) return false;
      const dueDate = new Date(p.crc53_estimatedduedate);
      return dueDate >= now && dueDate <= sixtyDays;
    });

    // Blocked projects
    const blockedProjects = projects.filter(p => p.crc53_status === ProjectStatus.Blocked);

    // Customer project counts
    const customerProjectCounts = projects.reduce((acc, project) => {
      if (!project.crc53_customerid) return acc;
      const customerId = project.crc53_customerid.crc53_customerid;
      const customerName = project.crc53_customerid.crc53_name;
      
      if (!acc[customerId]) {
        acc[customerId] = {
          name: customerName,
          count: 0,
          active: 0,
          blocked: 0,
        };
      }
      acc[customerId].count++;
      if (project.crc53_status === ProjectStatus.InProgress) acc[customerId].active++;
      if (project.crc53_status === ProjectStatus.Blocked) acc[customerId].blocked++;
      
      return acc;
    }, {} as Record<string, { name: string; count: number; active: number; blocked: number }>);

    const topCustomers = Object.entries(customerProjectCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status breakdown
    const statusCounts = projects.reduce((acc, project) => {
      const status = project.crc53_status ?? ProjectStatus.Backlog;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<ProjectStatus, number>);

    return {
      dueNext7Days,
      dueNext30Days,
      dueNext60Days,
      blockedProjects,
      topCustomers,
      statusCounts,
      totalProjects: projects.length,
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/80 mt-1">Overview of your projects and upcoming deadlines</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalProjects}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Next 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{dashboardData.dueNext7Days.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Next 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{dashboardData.dueNext30Days.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blocked Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{dashboardData.blockedProjects.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Due Soon */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <CardTitle>Due Next 7 Days</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.dueNext7Days.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No projects due in the next 7 days</div>
            ) : (
              <div className="space-y-3">
                {dashboardData.dueNext7Days.map((project) => (
                  <Link
                    key={project.crc53_projectid}
                    to={`/project/${project.crc53_projectid}`}
                    className="block"
                  >
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium">{project.crc53_name}</div>
                          {project.crc53_customerid && (
                            <div className="text-sm text-muted-foreground">
                              {project.crc53_customerid.crc53_name}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-orange-600 font-medium">
                          {formatDate(project.crc53_estimatedduedate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blocked Projects */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <CardTitle>Blocked Projects</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.blockedProjects.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No blocked projects</div>
            ) : (
              <div className="space-y-3">
                {dashboardData.blockedProjects.map((project) => (
                  <Link
                    key={project.crc53_projectid}
                    to={`/project/${project.crc53_projectid}`}
                    className="block"
                  >
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium">{project.crc53_name}</div>
                          {project.crc53_customerid && (
                            <div className="text-sm text-muted-foreground">
                              {project.crc53_customerid.crc53_name}
                            </div>
                          )}
                        </div>
                        {project.crc53_primarytechnology !== undefined && (
                          <Badge className="text-xs bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white">
                            {TechnologyTypeLabels[project.crc53_primarytechnology]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers by Project Count */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle>Top Customers by Projects</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.topCustomers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No customer data</div>
            ) : (
              <div className="space-y-3">
                {dashboardData.topCustomers.map((customer) => (
                  <Link
                    key={customer.id}
                    to={`/customer/${customer.id}`}
                    className="block"
                  >
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {customer.active} active, {customer.blocked} blocked
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {customer.count} {customer.count === 1 ? 'project' : 'projects'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Status Breakdown */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <CardTitle>Project Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(ProjectStatusLabels).map(([statusValue, statusLabel]) => {
                const status = Number(statusValue) as ProjectStatus;
                const count = dashboardData.statusCounts[status] || 0;
                
                return (
                  <Link
                    key={statusValue}
                    to={`/projects?status=${status}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Badge className={`${ProjectStatusColors[status]} text-white`}>
                          {statusLabel}
                        </Badge>
                      </div>
                      <div className="text-lg font-semibold">{count}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Due in 30 and 60 Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader>
            <CardTitle>Due Next 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.dueNext30Days.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No projects due in the next 30 days</div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {dashboardData.dueNext30Days.map((project) => (
                  <Link
                    key={project.crc53_projectid}
                    to={`/project/${project.crc53_projectid}`}
                    className="block"
                  >
                    <div className="p-2 border rounded hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium truncate flex-1">{project.crc53_name}</div>
                        <div className="text-xs text-muted-foreground ml-2">
                          {formatDate(project.crc53_estimatedduedate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader>
            <CardTitle>Due Next 60 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.dueNext60Days.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No projects due in the next 60 days</div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {dashboardData.dueNext60Days.map((project) => (
                  <Link
                    key={project.crc53_projectid}
                    to={`/project/${project.crc53_projectid}`}
                    className="block"
                  >
                    <div className="p-2 border rounded hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium truncate flex-1">{project.crc53_name}</div>
                        <div className="text-xs text-muted-foreground ml-2">
                          {formatDate(project.crc53_estimatedduedate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
