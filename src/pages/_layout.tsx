import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(233,85%,58%)] via-[hsl(265,75%,65%)] to-[hsl(233,85%,58%)]">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/icon.png" 
                alt="CSA Logo" 
                className="w-10 h-10 rounded-xl shadow-lg"
              />
              <h1 className="text-xl font-bold text-gray-800">
                ArchTrack
              </h1>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link to="/">
                <button
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === '/'
                      ? 'bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
              </Link>
              
              <Link to="/projects">
                <button
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname.startsWith('/project')
                      ? 'bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Projects
                </button>
              </Link>
              
              <Link to="/customer">
                <button
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive('/customer')
                      ? 'bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Users className="w-4 h-4" />
                  Customers
                </button>
              </Link>
              
              <Link to="/reports">
                <button
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive('/reports')
                      ? 'bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
              </Link>
              
              <Link to="/settings">
                <button
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2',
                    isActive('/settings')
                      ? 'bg-gradient-to-r from-[hsl(233,85%,58%)] to-[hsl(265,75%,65%)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
}
