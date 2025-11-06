import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Calendar, Building2, Search, User, LayoutGrid, LayoutList } from 'lucide-react';
import { useProjects, useUpdateProject } from '@/hooks/use-projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TechnologyTypeLabels, ProjectStatus, ProjectStatusLabels, ProjectStatusColors } from '@/types';
import { formatDate } from '@/lib/utils';
import { useConfig } from '@/contexts/config-context';
import SetupPromptModal from '@/components/setup-prompt-modal';
import SettingsModal from '@/components/settings-modal';
import DemoModePrompt from '@/components/demo-mode-prompt';
import { toast } from 'sonner';

type ViewMode = 'list' | 'kanban';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: projects, isLoading, error } = useProjects();
  const updateProject = useUpdateProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const { isConfigured, isDemoMode } = useConfig();
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDemoPrompt, setShowDemoPrompt] = useState(false);

  // Read status filter from URL on mount
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        project.crc53_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.crc53_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.crc53_customerid?.crc53_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.crc53_primarystakeholder?.toLowerCase().includes(searchQuery.toLowerCase());

      // Technology filter
      const matchesTech =
        techFilter === 'all' ||
        project.crc53_primarytechnology?.toString() === techFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (project.crc53_status ?? ProjectStatus.Backlog).toString() === statusFilter;

      return matchesSearch && matchesTech && matchesStatus;
    });
  }, [projects, searchQuery, techFilter, statusFilter]);

  // Drag and drop handlers for kanban
  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProjectId(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: ProjectStatus) => {
    e.preventDefault();
    
    if (!draggedProjectId) return;

    const project = projects?.find(p => p.crc53_projectid === draggedProjectId);
    if (!project) return;

    // Don't update if status hasn't changed
    if (project.crc53_status === newStatus) {
      setDraggedProjectId(null);
      return;
    }

    try {
      await updateProject.mutateAsync({
        id: draggedProjectId,
        data: { crc53_status: newStatus }
      });
      toast.success(`Project moved to ${ProjectStatusLabels[newStatus]}`);
    } catch (error) {
      toast.error('Failed to update project status');
    } finally {
      setDraggedProjectId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedProjectId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">Error loading projects: {error.message}</div>
      </div>
    );
  }

  const handleNewProject = (e: React.MouseEvent) => {
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
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-white/80 mt-1">
            Manage your customer projects
          </p>
        </div>
        <Link to="/project/create" onClick={handleNewProject}>
          <Button className="bg-gradient-to-r from-[hsl(35,95%,58%)] to-[hsl(35,95%,48%)] hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects, stakeholders, or customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/95 backdrop-blur-sm border-white/50"
          />
        </div>
        <Select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="w-full sm:w-48 bg-white/95 backdrop-blur-sm border-white/50"
        >
          <option value="all">All Technologies</option>
          {Object.entries(TechnologyTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            // Update URL when manually changing filter
            if (e.target.value === 'all') {
              setSearchParams({});
            } else {
              setSearchParams({ status: e.target.value });
            }
          }}
          className="w-full sm:w-48 bg-white/95 backdrop-blur-sm border-white/50"
        >
          <option value="all">All Statuses</option>
          {Object.entries(ProjectStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('kanban')}
            title="Kanban View"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      {projects && projects.length > 0 && (
        <div className="text-sm text-white/80">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}

      {!filteredProjects || filteredProjects.length === 0 ? (
        <Card className="p-12 text-center bg-white/95 backdrop-blur-sm border-white/50">
          <div className="flex flex-col items-center gap-4">
            <div className="text-muted-foreground">No projects found</div>
            <Link to="/project/create">
              <Button className="bg-gradient-to-r from-[hsl(35,95%,58%)] to-[hsl(35,95%,48%)]">
                <Plus className="w-4 h-4 mr-2" />
                Create your first project
              </Button>
            </Link>
          </div>
        </Card>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.crc53_projectid}
              to={`/project/${project.crc53_projectid}`}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm border-white/50 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.crc53_name}
                    </CardTitle>
                    <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                      {(!isConfigured || isDemoMode) && (
                        <Badge variant="outline" className="border-orange-300 text-orange-600 bg-orange-50">
                          Sample Data
                        </Badge>
                      )}
                      {project.crc53_status !== undefined && (
                        <Badge className={`${ProjectStatusColors[project.crc53_status]} text-white`}>
                          {ProjectStatusLabels[project.crc53_status]}
                        </Badge>
                      )}
                      {project.crc53_primarytechnology !== undefined && (
                        <Badge className="bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white shadow-md">
                          {TechnologyTypeLabels[project.crc53_primarytechnology]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.crc53_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.crc53_description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {project.crc53_customerid && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4 text-[hsl(233,85%,58%)]" />
                        <span>{project.crc53_customerid.crc53_name}</span>
                      </div>
                    )}

                    {project.crc53_primarystakeholder && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 text-[hsl(265,75%,65%)]" />
                        <span>{project.crc53_primarystakeholder}</span>
                      </div>
                    )}
                    
                    {project.crc53_estimatedduedate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-[hsl(35,95%,58%)]" />
                        <span>Due: {formatDate(project.crc53_estimatedduedate)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        // Kanban Board View
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(ProjectStatusLabels).map(([statusValue, statusLabel]) => {
            const status = Number(statusValue) as ProjectStatus;
            const statusProjects = filteredProjects.filter(p => (p.crc53_status ?? ProjectStatus.Backlog) === status);
            
            return (
              <div key={statusValue} className="flex flex-col">
                <div className={`${ProjectStatusColors[status]} text-white p-3 rounded-t-lg font-semibold flex items-center justify-between`}>
                  <span>{statusLabel}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {statusProjects.length}
                  </Badge>
                </div>
                <div 
                  className="bg-white/50 backdrop-blur-sm rounded-b-lg p-2 space-y-2 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {statusProjects.map((project) => (
                    <div
                      key={project.crc53_projectid}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.crc53_projectid)}
                      onDragEnd={handleDragEnd}
                      className="cursor-move"
                    >
                      <Card 
                        className="hover:shadow-lg transition-all bg-white"
                        onClick={() => navigate(`/project/${project.crc53_projectid}`)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="font-medium text-sm line-clamp-2">
                            {project.crc53_name}
                          </div>
                          {project.crc53_customerid && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate">{project.crc53_customerid.crc53_name}</span>
                            </div>
                          )}
                          {project.crc53_primarytechnology !== undefined && (
                            <Badge className="text-xs bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white">
                              {TechnologyTypeLabels[project.crc53_primarytechnology]}
                            </Badge>
                          )}
                          {project.crc53_estimatedduedate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(project.crc53_estimatedduedate)}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
