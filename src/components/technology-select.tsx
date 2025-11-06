import { useState, useRef, useEffect } from 'react';
import { TechnologyType, TechnologyTypeLabels } from '@/types';
import { searchTechnologies, getTechnologiesForSolutionArea } from '@/lib/technology-utils';
import { Label } from '@/components/ui/label';

interface TechnologySelectProps {
  id: string;
  label: string;
  value: TechnologyType;
  onChange: (value: TechnologyType) => void;
  solutionArea?: string;
  required?: boolean;
}

export function TechnologySelect({ 
  id, 
  label, 
  value, 
  onChange, 
  solutionArea,
  required = false 
}: TechnologySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get technologies based on solution area or search
  const technologies = searchQuery 
    ? searchTechnologies(searchQuery, solutionArea)
    : getTechnologiesForSolutionArea(solutionArea);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (tech: TechnologyType) => {
    onChange(tech);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && '*'}</Label>
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-full px-3 py-2 border rounded-md bg-white cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          }}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? TechnologyTypeLabels[value] : 'Select technology...'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 flex flex-col">
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technologies..."
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(233,85%,58%)]"
              />
            </div>
            <div className="overflow-y-auto">
              {technologies.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  No technologies found
                </div>
              ) : (
                technologies.map((tech) => (
                  <div
                    key={tech}
                    onClick={() => handleSelect(tech)}
                    className={`px-3 py-2 cursor-pointer hover:bg-[hsl(233,85%,58%)]/10 text-sm ${
                      tech === value ? 'bg-[hsl(233,85%,58%)]/20 font-medium' : ''
                    }`}
                  >
                    {TechnologyTypeLabels[tech]}
                  </div>
                ))
              )}
            </div>
            {searchQuery && (
              <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
                {technologies.length > 0 
                  ? `${technologies.length} result${technologies.length === 1 ? '' : 's'} found`
                  : 'Try a different search term'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
