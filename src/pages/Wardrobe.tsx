
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import WardrobeGrid from '@/components/Wardrobe/WardrobeGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Tshirt, Menu } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SavedOutfits from '@/components/Outfit/SavedOutfits';

const Wardrobe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('items');

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Wardrobe</h1>
            <p className="text-muted-foreground mt-1">Browse and manage your clothing items and outfits</p>
          </div>
          <Button asChild>
            <Link to="/upload">
              <Plus size={16} className="mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
        
        <Tabs 
          defaultValue="items" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="items" className="flex items-center">
              <Tshirt size={16} className="mr-2" />
              Clothing Items
            </TabsTrigger>
            <TabsTrigger value="outfits" className="flex items-center">
              <Menu size={16} className="mr-2" />
              Saved Outfits
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="items">
            <WardrobeGrid />
          </TabsContent>
          
          <TabsContent value="outfits">
            <SavedOutfits />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Wardrobe;
