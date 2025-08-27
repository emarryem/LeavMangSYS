import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Calendar, 
  BarChart3, 
  Settings, 
  Home,
  Users
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/welcome', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Add admin routes for managers and HR
  if (user?.role === 'manager' || user?.role === 'hr') {
    navItems.splice(3, 0, { path: '/admin', label: 'Admin Panel', icon: Users });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="dashboard-header sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">ED Leave</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 ml-8">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-2"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:block text-right">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.department}</div>
        </div>
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">
            {user?.name?.charAt(0)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Logout</span>
        </Button>
      </div>
    </nav>
  );
};