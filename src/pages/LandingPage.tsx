
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/Auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="flex flex-col min-h-[calc(100vh-200px)] items-center justify-center py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Smart Wardrobe AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Organize your wardrobe, get outfit recommendations, and enhance your personal style with AI.
          </p>
        </div>

        {user ? (
          <div className="flex flex-col items-center space-y-6 max-w-md w-full">
            <p className="text-lg">Welcome back! Continue to your wardrobe.</p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link to="/wardrobe">My Wardrobe</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/upload">Upload Item</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        )}

        <div className="mt-16 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">Organize Your Wardrobe</h3>
              <p className="text-muted-foreground">
                Upload and categorize your clothing items for easy access and management.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">Get Outfit Suggestions</h3>
              <p className="text-muted-foreground">
                Receive AI-powered outfit recommendations based on your personal style.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">Plan Your Style</h3>
              <p className="text-muted-foreground">
                Create outfits for any occasion with our intuitive outfit builder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LandingPage;
