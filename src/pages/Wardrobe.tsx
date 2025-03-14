import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import WardrobeGrid from '@/components/Wardrobe/WardrobeGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Shirt, BookMarked, ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SavedOutfits from '@/components/Outfit/SavedOutfits';

const Wardrobe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('items');

  return (
    <MainLayout>
      <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Wardrobe</h1>
            <p className="text-muted-foreground mt-1">Browse and manage your clothing items and outfits</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button asChild size="sm" className="flex-1 sm:flex-none">
              <Link to="/upload">
                <Plus size={16} className="mr-2" />
                Add Item
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="flex-1 sm:flex-none group"
            >
              <Link to="/explore">
                <BookMarked size={16} className="mr-2" />
                Outfit Builder
                <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
          <Tabs 
            defaultValue="items" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b mb-6">
              <TabsList className="w-auto bg-transparent justify-start -mb-px">
                <TabsTrigger 
                  value="items" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  <Shirt size={16} className="mr-2" />
                  Clothing Items
                </TabsTrigger>
                <TabsTrigger 
                  value="outfits" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  <BookMarked size={16} className="mr-2" />
                  Saved Outfits
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="items" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <WardrobeGrid />
            </TabsContent>
            
            <TabsContent value="outfits" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <SavedOutfits />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Wardrobe;
