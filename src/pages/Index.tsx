
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import WeatherDisplay from '@/components/Weather/WeatherDisplay';
import OutfitRecommendation from '@/components/Outfit/OutfitRecommendation';
import OutfitBuilder from '@/components/Outfit/OutfitBuilder';
import WardrobeGrid from '@/components/Wardrobe/WardrobeGrid';
import { ArrowRight, Sparkles, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassmorphicContainer from '@/components/UI/GlassmorphicContainer';
import AnimatedCard from '@/components/UI/AnimatedCard';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm animate-fade-in">
              <Sparkles size={14} className="mr-2 text-primary" />
              <span>AI-Powered Outfit Recommendations</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight animate-slide-up">
              Your Smart Wardrobe Assistant
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              Organize your closet, get personalized outfit recommendations, and elevate your style with AI-powered fashion insights.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button size="lg" asChild>
                <Link to="/wardrobe">
                  Get Started
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/upload">
                  <Upload size={16} className="mr-2" />
                  Upload Clothing
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 max-w-md animate-scale-in">
            <GlassmorphicContainer className="p-8 relative aspect-square overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="col-span-2 aspect-video bg-accent/30 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1400&auto=format&fit=crop" 
                    alt="Wardrobe collection"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="aspect-square bg-muted/50 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1400&auto=format&fit=crop" 
                    alt="Outfit item"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="aspect-square bg-muted/50 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1400&auto=format&fit=crop" 
                    alt="Outfit item"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </GlassmorphicContainer>
          </div>
        </div>
      </section>
      
      {/* Weather and Recommendations Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <WeatherDisplay className="h-full" />
          </div>
          <div className="md:col-span-8">
            <OutfitRecommendation />
          </div>
        </div>
      </section>
      
      {/* Outfit Builder Section */}
      <section className="mb-16">
        <OutfitBuilder />
      </section>
      
      {/* Wardrobe Preview Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your Wardrobe</h2>
            <p className="text-muted-foreground mt-1">Manage and organize your clothing collection</p>
          </div>
          <Button asChild>
            <Link to="/wardrobe">
              View All Wardrobe
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
        
        <WardrobeGrid />
      </section>
      
      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-6 text-center">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard className="p-6" delay={0}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Sparkles size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">AI Recommendations</h3>
            <p className="text-muted-foreground">
              Get personalized outfit suggestions based on your style, wardrobe, and the weather.
            </p>
          </AnimatedCard>
          
          <AnimatedCard className="p-6" delay={150}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Upload size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Smart Organization</h3>
            <p className="text-muted-foreground">
              Easily upload and categorize your clothing items with automated tagging.
            </p>
          </AnimatedCard>
          
          <AnimatedCard className="p-6" delay={300}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Search size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Style Inspiration</h3>
            <p className="text-muted-foreground">
              Discover new outfit ideas and keep up with the latest fashion trends.
            </p>
          </AnimatedCard>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="mb-8">
        <GlassmorphicContainer className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              Ready to transform your wardrobe experience?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join Smart Wardrobe today and discover a new way to organize and style your clothing collection.
            </p>
            <Button size="lg" asChild>
              <Link to="/wardrobe">
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </GlassmorphicContainer>
      </section>
    </MainLayout>
  );
};

export default Index;
