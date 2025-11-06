import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

import Layout from '@/pages/_layout';
import { queryClient } from '@/lib/query-client';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/system/error-boundary';

// Static imports for all pages
import Dashboard from '@/pages/dashboard';
import ProjectsPage from '@/pages/projects';
import ProjectDetails from '@/pages/project/[id]';
import ProjectCreate from '@/pages/project/create';
import ProjectEdit from '@/pages/project/[id]/edit';
import ProjectDelete from '@/pages/project/[id]/delete';
import CustomerList from '@/pages/customer';
import CustomerCreate from '@/pages/customer/create';
import CustomerView from '@/pages/customer/[id]';
import CustomerEdit from '@/pages/customer/[id]/edit';
import CustomerDelete from '@/pages/customer/[id]/delete';
import ReportsPage from '@/pages/reports';
import SettingsPage from '@/pages/settings';
import NotFound from '@/pages/not-found';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize Power Apps if available
    const initializeApp = async () => {
      try {
        // Check if Power Apps is available
        if (typeof window !== 'undefined' && (window as any).Microsoft?.PowerApps) {
          const { initialize } = await import('@microsoft/power-apps/app');
          await initialize();
        }
      } catch (error) {
        console.warn('Power Apps not available, running in demo mode:', error);
      } finally {
        setInitialized(true);
      }
    };
    
    initializeApp();
  }, []);

  if (!initialized) {
    return <LoadingFallback />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary resetQueryCache>
        <JotaiProvider>
          <Toaster />
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="project/create" element={<ProjectCreate />} />
                  <Route path="project/:id" element={<ProjectDetails />} />
                  <Route path="project/:id/edit" element={<ProjectEdit />} />
                  <Route path="project/:id/delete" element={<ProjectDelete />} />
                  <Route path="customer" element={<CustomerList />} />
                  <Route path="customer/create" element={<CustomerCreate />} />
                  <Route path="customer/:id" element={<CustomerView />} />
                  <Route path="customer/:id/edit" element={<CustomerEdit />} />
                  <Route path="customer/:id/delete" element={<CustomerDelete />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </JotaiProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;