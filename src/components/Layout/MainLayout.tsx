
import React from 'react';
import Navbar from '../Navigation/Navbar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main 
        className={cn(
          "flex-1 pt-24 pb-16 transition-all duration-300",
          fullWidth ? "px-4" : "container max-w-screen-xl mx-auto px-4",
          className
        )}
      >
        {children}
      </main>
      <footer className="py-8 bg-muted/50">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Smart Wardrobe. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
