import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Building2, User, Cpu, ChevronDown, ChevronUp, ListChecks, Users as UsersIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useProject } from '@/hooks/use-projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TechnologyTypeLabels, ProjectStatusLabels, ProjectStatusColors } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id!);
  const [notesExpanded, setNotesExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-destructive">
          Error loading project: {error?.message || 'Project not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/projects')}
          className="bg-white hover:bg-white/90"
        >
          <ArrowLeft className="w-4 h-4 text-gray-800" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{project.crc53_name}</h1>
        </div>
        <Link to={`/project/${id}/edit`}>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Link to={`/project/${id}/delete`}>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Information</CardTitle>
              {project.crc53_primarytechnology !== undefined && (
                <Badge className="bg-blue-500 text-white">
                  {TechnologyTypeLabels[project.crc53_primarytechnology]}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.crc53_description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h3>
                <p className="text-base">{project.crc53_description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.crc53_status !== undefined && (
                <div className="flex items-start gap-3">
                  <ListChecks className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Status
                    </h3>
                    <Badge className={`${ProjectStatusColors[project.crc53_status]} text-white mt-1`}>
                      {ProjectStatusLabels[project.crc53_status]}
                    </Badge>
                  </div>
                </div>
              )}

              {project.crc53_customerid && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Customer
                    </h3>
                    <p className="text-base font-medium">
                      {project.crc53_customerid.crc53_name}
                    </p>
                  </div>
                </div>
              )}

              {project.crc53_primarystakeholder && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Primary Stakeholder
                    </h3>
                    <p className="text-base font-medium">
                      {project.crc53_primarystakeholder}
                    </p>
                  </div>
                </div>
              )}

              {project.crc53_estimatedduedate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Estimated Due Date
                    </h3>
                    <p className="text-base">
                      {formatDate(project.crc53_estimatedduedate)}
                    </p>
                  </div>
                </div>
              )}

              {project.crc53_primarytechnology !== undefined && (
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Primary Technology
                    </h3>
                    <p className="text-base">
                      {TechnologyTypeLabels[project.crc53_primarytechnology]}
                    </p>
                  </div>
                </div>
              )}

              {project.crc53_estimatedusage && (
                <div className="flex items-start gap-3">
                  <UsersIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Estimated Usage
                    </h3>
                    <p className="text-base">
                      {project.crc53_estimatedusage}
                    </p>
                  </div>
                </div>
              )}

              {project.crc53_hasintent !== undefined && (
                <div className="flex items-start gap-3">
                  {project.crc53_hasintent ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Is there intent?
                    </h3>
                    <p className="text-base font-medium">
                      {project.crc53_hasintent ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              )}

              {project.crc53_hasbuyin !== undefined && (
                <div className="flex items-start gap-3">
                  {project.crc53_hasbuyin ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Do we have buy-in?
                    </h3>
                    <p className="text-base font-medium">
                      {project.crc53_hasbuyin ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {project.crc53_notes && project.crc53_notes.length > 0 && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => setNotesExpanded(!notesExpanded)}
                  className="flex items-center justify-between w-full text-left mb-2"
                >
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Notes ({project.crc53_notes.length})
                  </h3>
                  {notesExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {notesExpanded && (
                  <div className="space-y-3">
                    {project.crc53_notes
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((note) => (
                        <div key={note.id} className="bg-muted p-3 rounded-lg">
                          <p className="text-sm mb-1">{note.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(note.timestamp)}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t text-sm text-muted-foreground">
              <p>Created: {formatDate(project.createdon)}</p>
              <p>Last modified: {formatDate(project.modifiedon)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
