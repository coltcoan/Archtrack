import { useEffect } from 'react';
import { AlertCircle, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SetupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetup: () => void;
}

export default function SetupPromptModal({ isOpen, onClose, onSetup }: SetupPromptModalProps) {
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Setup Required</h2>
              <p className="text-sm text-gray-600">Configure your database location</p>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              You're currently viewing sample data. To add, edit, or remove projects and customers, 
              you need to configure where your data will be stored.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Click the button below to select a folder on your computer where your project data will live. 
              The app will create the necessary folders automatically.
            </p>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onSetup}
            className="bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] hover:from-[hsl(233,85%,52%)] hover:to-[hsl(265,75%,58%)] text-white"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Set Up ArchTrack
          </Button>
        </div>
      </div>
    </div>
  );
}
