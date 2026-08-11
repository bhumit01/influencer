import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Search,
  MessageSquare,
  UserCircle,
  Image,
  Briefcase,
  Settings,
  LogOut,
} from 'lucide-react';

const brandNav = [
  { href: '/brand/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brand/discover', label: 'Discover', icon: Search },
  { href: '/brand/enquiries', label: 'Enquiries', icon: MessageSquare },
];

const influencerNav = [
  { href: '/influencer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/influencer/edit-profile', label: 'Profile', icon: UserCircle },
  { href: '/influencer/gallery', label: 'Gallery', icon: Image },
  { href: '/influencer/collaborations', label: 'Collaborations', icon: Briefcase },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const navItems = user.role === 'brand' ? brandNav : influencerNav;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-neutral-200 bg-white">
        <div className="p-6 border-b border-neutral-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">IH</span>
            </div>
            <span className="text-base font-bold text-neutral-900">InfluenceHub</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
                location.pathname === item.href
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-50 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">IH</span>
              </div>
              <span className="text-sm font-bold">InfluenceHub</span>
            </Link>
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    location.pathname === item.href
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-500'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
              <button
                onClick={logout}
                className="p-2 text-neutral-500 hover:text-neutral-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
