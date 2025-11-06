import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidationStep {
  id: string;
  label: string;
  status: 'pending' | 'validating' | 'success' | 'error';
  message?: string;
}

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (allPassed: boolean) => void;
}

export default function ValidationModal({ isOpen, onClose, onComplete }: ValidationModalProps) {
  const [steps, setSteps] = useState<ValidationStep[]>([
    { id: 'datasource', label: 'Data Source Path', status: 'pending' },
    { id: 'solution', label: 'Solution & Technology Categories', status: 'pending' },
    { id: 'projects', label: 'Project Records', status: 'pending' },
    { id: 'customers', label: 'Customer Records', status: 'pending' },
  ]);

  const [isValidating, setIsValidating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setHasRun(false);
      setIsComplete(false);
      setIsValidating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isValidating && !hasRun) {
      setHasRun(true);
      startValidation();
    }
  }, [isOpen, isValidating, hasRun]);

  const updateStep = (id: string, status: ValidationStep['status'], message?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, status, message } : step
    ));
  };

  const startValidation = async () => {
    setIsValidating(true);
    setIsComplete(false);

    // Reset all steps
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));

    // Step 1: Validate data source path
    await validateStep('datasource', async () => {
      const response = await fetch('http://localhost:3001/api/settings/is-configured');
      const data = await response.json();
      
      if (!data.isConfigured || !data.databasePath) {
        throw new Error('Data source path not configured');
      }
      
      return `Path: ${data.databasePath}`;
    });

    await delay(300);

    // Step 2: Validate solution and technology categories
    await validateStep('solution', async () => {
      const response = await fetch('http://localhost:3001/api/settings/technology');
      const data = await response.json();
      
      if (!data.solutionAreas || data.solutionAreas.length === 0) {
        throw new Error('No solution areas configured');
      }
      
      const techCount = data.solutionAreas.reduce((sum: number, sa: any) => 
        sum + (sa.technologies?.length || 0), 0
      );
      
      return `${data.solutionAreas.length} solution areas, ${techCount} technologies`;
    });

    await delay(300);

    // Step 3: Validate projects
    await validateStep('projects', async () => {
      const response = await fetch('http://localhost:3001/api/projects');
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Failed to load projects');
      }
      
      return `${data.length} project${data.length !== 1 ? 's' : ''} loaded`;
    });

    await delay(300);

    // Step 4: Validate customers
    await validateStep('customers', async () => {
      const response = await fetch('http://localhost:3001/api/customers');
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Failed to load customers');
      }
      
      return `${data.length} customer${data.length !== 1 ? 's' : ''} loaded`;
    });

    setIsValidating(false);
    setIsComplete(true);

    // Check if all steps passed (need to check the updated steps state)
    setTimeout(() => {
      setSteps(currentSteps => {
        const allPassed = currentSteps.every(step => step.status === 'success');
        if (onComplete) {
          onComplete(allPassed);
        }
        return currentSteps;
      });
    }, 100);
  };

  const validateStep = async (id: string, validator: () => Promise<string>) => {
    updateStep(id, 'validating');
    await delay(500); // Add a small delay for visual effect

    try {
      const message = await validator();
      updateStep(id, 'success', message);
    } catch (error) {
      updateStep(id, 'error', error instanceof Error ? error.message : 'Validation failed');
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getStatusIcon = (status: ValidationStep['status']) => {
    switch (status) {
      case 'pending':
        return '⚪';
      case 'validating':
        return <Loader2 className="w-4 h-4 animate-spin inline" />;
      case 'success':
        return '🟢';
      case 'error':
        return '🔴';
    }
  };

  const handleClose = () => {
    if (!isValidating) {
      onClose();
      // Reset after a delay
      setTimeout(() => {
        setIsComplete(false);
        setSteps(prev => prev.map(step => ({ ...step, status: 'pending', message: undefined })));
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Configuration Validation</h2>
          <button
            onClick={handleClose}
            disabled={isValidating}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getStatusIcon(step.status)}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{step.label}</div>
                  {step.message && (
                    <div className={`text-xs ${step.status === 'error' ? 'text-red-600' : 'text-gray-500'}`}>
                      {step.message}
                    </div>
                  )}
                </div>
                {step.status === 'validating' && (
                  <span className="text-xs text-gray-500">Checking...</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          {isComplete ? (
            <div className="space-y-3">
              <p className="text-sm text-center text-gray-600">
                {steps.every(s => s.status === 'success') 
                  ? 'All validation checks passed!' 
                  : 'Some validation checks failed. Please review the errors above.'}
              </p>
              <Button
                onClick={handleClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          ) : isValidating ? (
            <div className="text-center text-sm text-gray-600">
              Validating configuration...
            </div>
          ) : (
            <Button
              onClick={startValidation}
              className="w-full"
            >
              Start Validation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
