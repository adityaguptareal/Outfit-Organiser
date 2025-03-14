import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shirt, Home, UserCircle2, Upload, Search } from 'lucide-react';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Shirt size={20} />, label: 'Wardrobe', path: '/wardrobe' },
    { icon: <Upload size={20} />, label: 'Upload', path: '/upload' },
    { icon: <Search size={20} />, label: 'Outfits', path: '/explore' },
    { icon: <UserCircle2 size={20} />, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container max-w-screen-xl mx-auto px-4">
        <GlassmorphicContainer 
          className="py-3 px-5"
          intensity={scrolled ? 'high' : 'medium'}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary text-primary-foreground rounded-lg p-1.5 transition-transform duration-300 group-hover:scale-105">
                <Shirt size={20} />
              </div>
              <span className="font-semibold text-lg tracking-tight">Smart Wardrobe</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md flex items-center space-x-1.5 transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="flex md:hidden items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </GlassmorphicContainer>
      </div>
    </header>
  );
};

export default Navbar;
