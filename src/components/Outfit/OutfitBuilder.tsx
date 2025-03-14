import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getWardrobeItemsByCategory } from '@/services/wardrobeService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Sparkles, Save, Search } from 'lucide-react';
import WardrobeGrid from '@/components/Wardrobe/WardrobeGrid';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface OutfitBuilderProps {
  preselectedOutfit?: any;
}

const outfitTypes = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'business', label: 'Business' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' }
];

const categories = ['tops', 'bottoms', 'footwear', 'accessories'];

const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ preselectedOutfit }) => {
  console.log("OutfitBuilder rendered with preselectedOutfit:", preselectedOutfit);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('tops');
  const [selectedItems, setSelectedItems] = useState<Record<string, ClothingItemProps | null>>({
    tops: null,
    bottoms: null,
    footwear: null,
    accessories: null,
  });
  const [isAILoading, setIsAILoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [outfitType, setOutfitType] = useState('casual');

  // Fetch items for the active category
  const { data: categoryItems, isLoading } = useQuery({
    queryKey: ['wardrobeItems', user?.id, activeCategory],
    queryFn: () => getWardrobeItemsByCategory(activeCategory),
    enabled: !!user,
  });

  // Set preselected outfit items if provided
  useEffect(() => {
    if (preselectedOutfit && preselectedOutfit.items) {
      console.log("Processing preselectedOutfit items:", preselectedOutfit.items);
      
      const itemsByCategory = {};
      
      // Process preselected outfit items
      preselectedOutfit.items.forEach(item => {
        if (item && item.category) {
          itemsByCategory[item.category] = item;
        }
      });
      
      setSelectedItems(prev => ({
        ...prev,
        ...itemsByCategory
      }));
      
      // Set outfit name based on preselected outfit
      if (preselectedOutfit.name) {
        setOutfitName(preselectedOutfit.name);
      }
    }
  }, [preselectedOutfit]);

  // AI suggestion function
  const getAISuggestion = async (category: string) => {
    setIsAILoading(true);
    
    try {
      if (categoryItems && categoryItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryItems.length);
        const suggestion = categoryItems[randomIndex];
        
        setSelectedItems(prev => ({
          ...prev,
          [category]: suggestion
        }));
        
        toast({
          title: "AI Suggestion",
          description: `Found a perfect ${category} item for your outfit!`,
        });
      } else {
        toast({
          title: "No Items Available",
          description: `No ${category} items found in your wardrobe.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Couldn't get AI suggestions at this time.`,
        variant: "destructive",
      });
    } finally {
      setIsAILoading(false);
    }
  };

  // Handle item selection
  const handleItemSelect = (item: ClothingItemProps) => {
    console.log("handleItemSelect called with item:", item);
    
    setSelectedItems(prev => ({
      ...prev,
      [activeCategory]: item
    }));
  };

  const handleRemoveItem = (category: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleSaveOutfit = () => {
    // Filter out null items
    const items = Object.entries(selectedItems)
      .filter(([_, item]) => item !== null)
      .map(([category, item]) => item);
    
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item for your outfit.",
        variant: "destructive",
      });
      return;
    }
    
    // Open save dialog
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (!outfitName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your outfit.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock save for now
    toast({
      title: "Success",
      description: "Outfit saved successfully!",
    });
    
    setSaveDialogOpen(false);
    setOutfitName('');
  };

  const isOutfitComplete = Object.values(selectedItems).some(item => item !== null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Selected Items Preview */}
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold">Your Outfit</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card 
                key={category} 
                className={`overflow-hidden cursor-pointer ${activeCategory === category ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {selectedItems[category] ? (
                      <>
                        <img 
                          src={selectedItems[category].image} 
                          alt={selectedItems[category].name}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(category);
                          }}
                        >
                          ✕
                        </Button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-sm font-medium capitalize">{category}</p>
                        <p className="text-xs text-muted-foreground">No item selected</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSaveOutfit} 
              disabled={!isOutfitComplete}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Complete Outfit
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/saved-outfits')}
              className="w-full"
            >
              <Search className="mr-2 h-4 w-4" />
              View All Outfits
            </Button>
          </div>
        </div>
        
        {/* Item Selection */}
        <div className="w-full md:w-2/3">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => getAISuggestion(activeCategory)}
                disabled={isAILoading}
              >
                {isAILoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                AI Suggestion
              </Button>
            </div>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <WardrobeGrid 
                  categoryFilter={category}
                  onSelectItem={handleItemSelect}
                  selectionMode={true}
                  isLoading={isLoading && activeCategory === category}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Save Outfit Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Outfit</DialogTitle>
            <DialogDescription>
              Give your outfit a name and select its type to save it to your collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="outfitName">Outfit Name</Label>
              <Input 
                id="outfitName" 
                value={outfitName} 
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="e.g., Summer Casual"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outfitType">Outfit Type</Label>
              <Select value={outfitType} onValueChange={setOutfitType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outfit type" />
                </SelectTrigger>
                <SelectContent>
                  {outfitTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>
              Save Outfit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutfitBuilder;
