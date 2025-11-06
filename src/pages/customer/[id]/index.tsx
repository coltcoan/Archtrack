import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Users, Pencil, Trash2 } from 'lucide-react';
import { useCustomer, useDeleteCustomer } from '@/hooks/use-customers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TechnologyTypeLabels } from '@/types';
import { formatDate } from '@/lib/utils';

export default function CustomerView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id!);
  const deleteCustomer = useDeleteCustomer();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCustomer.mutateAsync(id!);
      navigate('/customer');
    } catch (error) {
      setIsDeleting(false);
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/customer">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white hover:bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 text-gray-800" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{customer.crc53_name}</h1>
          <p className="text-white/80 mt-1">Customer Details</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/customer/${id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customer Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
              <div className="text-lg font-semibold mt-1">{customer.crc53_name}</div>
            </div>

            {customer.crc53_primarytechfocus !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Primary Technology Focus</label>
                <div className="mt-2">
                  <Badge className="bg-blue-500 text-white">
                    {TechnologyTypeLabels[customer.crc53_primarytechfocus]}
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="mt-1">{formatDate(customer.createdon)}</div>
              </div>
              {customer.modifiedon && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                  <div className="mt-1">{formatDate(customer.modifiedon)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stakeholders Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Key Stakeholders
              </CardTitle>
              {customer.crc53_keystakeholders && (
                <Badge variant="secondary">
                  {customer.crc53_keystakeholders.length} stakeholder{customer.crc53_keystakeholders.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {customer.crc53_keystakeholders && customer.crc53_keystakeholders.length > 0 ? (
              <div className="space-y-4">
                {customer.crc53_keystakeholders.map((stakeholder) => (
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
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No stakeholders added yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !isDeleting && setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{customer.crc53_name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Customer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
