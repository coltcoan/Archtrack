import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoModePromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModePrompt({ isOpen, onClose }: DemoModePromptProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Demo Mode Active
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You're currently in demo mode. Data cannot be added, edited, or deleted while 
                demo mode is enabled. Turn off demo mode in Settings to make changes.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] hover:from-[hsl(233,85%,52%)] hover:to-[hsl(265,75%,58%)] text-white"
            >
              Got It
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
