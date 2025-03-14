import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import OutfitBuilder from '@/components/Outfit/OutfitBuilder';
import SavedOutfits from '@/components/Outfit/SavedOutfits';
import { motion } from 'framer-motion';
import { BookMarked, Sparkles } from 'lucide-react';

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('saved');

  return (
    <MainLayout>
      <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Outfits</h1>
            <p className="text-muted-foreground mt-1">Browse your saved outfits or create new ones</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
          <Tabs 
            defaultValue="saved" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b mb-6">
              <TabsList className="w-auto bg-transparent justify-start -mb-px">
                <TabsTrigger 
                  value="saved" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  <BookMarked size={16} className="mr-2" />
                  Saved Outfits
                </TabsTrigger>
                <TabsTrigger 
                  value="builder" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  <Sparkles size={16} className="mr-2" />
                  Outfit Builder
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="saved" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SavedOutfits />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="builder" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OutfitBuilder />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Explore;
