import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Shirt, Heart, Settings, LogOut, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  {
    icon: <Home className="h-5 w-5" />,
    label: 'Home',
    href: '/wardrobe',
  },
  {
    icon: <Shirt className="h-5 w-5" />,
    label: 'Wardrobe',
    href: '/wardrobe',
  },
  {
    icon: <Heart className="h-5 w-5" />,
    label: 'Explore',
    href: '/explore',
  },
  {
    icon: <Bookmark className="h-5 w-5" />,
    label: 'Saved Outfits',
    href: '/saved-outfits',
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: 'Profile',
    href: '/profile',
  },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <nav className="flex flex-col gap-2">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            location.pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      <button
        onClick={signOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </nav>
  );
};

export default Navigation; 