
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import OutfitRecommendation from '@/components/Outfit/OutfitRecommendation';
import OutfitBuilder from '@/components/Outfit/OutfitBuilder';
import SavedOutfits from '@/components/Outfit/SavedOutfits';

const Explore: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold">Explore Outfits</h1>
          <p className="text-muted-foreground mt-1">Discover new outfit combinations and create your own</p>
        </div>
        
        <OutfitBuilder />
        
        <SavedOutfits />
        
        <OutfitRecommendation />
      </div>
    </MainLayout>
  );
};

export default Explore;
