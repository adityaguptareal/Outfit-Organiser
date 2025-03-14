import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import OutfitBuilder from '@/components/Outfit/OutfitBuilder';

// Sample recommended outfits data
const recommendedOutfits = [
  {
    id: '1',
    name: 'Business Casual',
    description: 'Perfect for office days',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop',
    items: [
      { id: 'top1', name: 'White Button-Down Shirt', category: 'tops', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop' },
      { id: 'bottom1', name: 'Navy Chinos', category: 'bottoms', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1997&auto=format&fit=crop' },
      { id: 'footwear1', name: 'Brown Loafers', category: 'footwear', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1972&auto=format&fit=crop' },
    ]
  },
  {
    id: '2',
    name: 'Weekend Casual',
    description: 'Relaxed weekend look',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop',
    items: [
      { id: 'top2', name: 'Gray T-Shirt', category: 'tops', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop' },
      { id: 'bottom2', name: 'Blue Jeans', category: 'bottoms', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926&auto=format&fit=crop' },
      { id: 'footwear2', name: 'White Sneakers', category: 'footwear', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1965&auto=format&fit=crop' },
    ]
  },
  {
    id: '3',
    name: 'Evening Out',
    description: 'Stylish for dinner or drinks',
    image: 'https://images.unsplash.com/photo-1617196701537-7329482cc9fe?q=80&w=1974&auto=format&fit=crop',
    items: [
      { id: 'top3', name: 'Black Dress Shirt', category: 'tops', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1974&auto=format&fit=crop' },
      { id: 'bottom3', name: 'Dark Jeans', category: 'bottoms', image: 'https://images.unsplash.com/photo-1604176424472-9d7122c67c3c?q=80&w=1980&auto=format&fit=crop' },
      { id: 'footwear3', name: 'Chelsea Boots', category: 'footwear', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1935&auto=format&fit=crop' },
    ]
  },
];

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [activeTab, setActiveTab] = useState('recommended');

  const handleTryOutfit = (outfit) => {
    setSelectedOutfit(outfit);
    // Switch to outfit builder tab
    setActiveTab('builder');
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Explore Outfits</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recommended">Recommended Outfits</TabsTrigger>
            <TabsTrigger value="builder">Outfit Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedOutfits.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={outfit.image} 
                      alt={outfit.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{outfit.name}</CardTitle>
                    <CardDescription>{outfit.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => handleTryOutfit(outfit)}
                      className="w-full"
                    >
                      Try This Outfit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="builder">
            <OutfitBuilder preselectedOutfit={selectedOutfit} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Explore;
