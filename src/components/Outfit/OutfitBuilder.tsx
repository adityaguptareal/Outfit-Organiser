import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';
import WardrobeGrid from '@/components/Wardrobe/WardrobeGrid';
import { Plus, Save, Trash2, Camera, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/UI/badge';
import { useMediaQuery } from '@/hooks/use-media-query';

// Import dialog components directly to avoid casing issues
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';

interface OutfitBuilderProps {
  onSaveOutfit?: (outfitData: any) => void;
}

const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ onSaveOutfit }) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItemProps[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [outfitType, setOutfitType] = useState('casual');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('outfit');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Group selected items by category
  const itemsByCategory = selectedItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ClothingItemProps[]>);

  const handleSelectItem = (item: ClothingItemProps) => {
    // Check if item is already selected
    const isAlreadySelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
    
    if (isAlreadySelected) {
      // Remove item if already selected
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
      toast(`Removed ${item.name} from your outfit`);
    } else {
      // Add item if not already selected
      setSelectedItems([...selectedItems, item]);
      toast(`Added ${item.name} to your outfit`);
    }
    
    // Switch back to outfit tab on mobile after selecting an item
    if (isMobile) {
      setActiveTab('outfit');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
    toast('Item removed from outfit');
  };

  const handleClearOutfit = () => {
    if (selectedItems.length === 0) return;
    
    toast('Clear all items from this outfit?', {
      action: {
        label: 'Clear',
        onClick: () => {
          setSelectedItems([]);
          toast('Outfit cleared');
        }
      }
    });
  };

  const handleSaveOutfit = () => {
    if (selectedItems.length === 0) {
      toast('Please add at least one item to your outfit', {
        description: 'Your outfit needs at least one item',
      });
      return;
    }
    
    setIsDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (!outfitName.trim()) {
      toast('Please enter an outfit name', {
        description: 'Your outfit needs a name',
      });
      return;
    }

    const outfitData = {
      name: outfitName,
      type: outfitType,
      items: selectedItems,
    };

    if (onSaveOutfit) {
      onSaveOutfit(outfitData);
    }

    toast(`Outfit "${outfitName}" saved successfully`);
    setIsDialogOpen(false);
    
    // Optional: clear the builder after saving
    // setSelectedItems([]);
    // setOutfitName('');
  };

  const outfitTypeOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'business', label: 'Business' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'evening', label: 'Evening' },
    { value: 'vacation', label: 'Vacation' },
  ];

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      {isMobile ? (
        // Mobile Layout with Tabs
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="outfit" className="flex items-center gap-2">
                <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center">
                  {selectedItems.length}
                </Badge>
                Your Outfit
              </TabsTrigger>
              <TabsTrigger value="items">Select Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="outfit" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Outfit</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearOutfit}
                      disabled={selectedItems.length === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveOutfit}
                      disabled={selectedItems.length === 0}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
                
                {selectedItems.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(itemsByCategory).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-medium capitalize">{category}</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {items.map(item => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group aspect-square rounded-md overflow-hidden border"
                            >
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                <p className="text-xs text-white truncate">{item.name}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <div className="flex flex-col items-center max-w-md mx-auto">
                      <div className="text-4xl mb-4">👕</div>
                      <h3 className="text-xl font-medium mb-2">No items selected</h3>
                      <p className="text-muted-foreground mb-6 px-4">
                        Tap "Select Items" to start building your outfit
                      </p>
                      <Button 
                        onClick={() => setActiveTab('items')}
                        className="group"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Items
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="items" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Select Items</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab('outfit')}
                    className="group"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Outfit
                    <Badge variant="outline" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                      {selectedItems.length}
                    </Badge>
                  </Button>
                </div>
                
                <WardrobeGrid 
                  onSelectItem={handleSelectItem} 
                  selectionMode={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Desktop Layout (Side by Side)
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="p-6 border-r">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Your Outfit</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearOutfit}
                  disabled={selectedItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveOutfit}
                  disabled={selectedItems.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Outfit
                </Button>
              </div>
            </div>
            
            <div className="h-[calc(100vh-250px)] overflow-y-auto pr-4">
              {selectedItems.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-sm font-medium capitalize flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {items.length}
                        </Badge>
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <AnimatePresence>
                          {items.map(item => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group aspect-square rounded-lg overflow-hidden border"
                            >
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                <p className="text-xs text-white truncate">{item.name}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/10 h-full flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center max-w-md mx-auto">
                    <div className="text-4xl mb-4">👕</div>
                    <h3 className="text-xl font-medium mb-2">No items selected</h3>
                    <p className="text-muted-foreground mb-6 px-4">
                      Select items from your wardrobe to create an outfit
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="p-6 bg-muted/5">
            <h3 className="text-xl font-medium mb-6">Select Items</h3>
            <WardrobeGrid 
              onSelectItem={handleSelectItem} 
              selectionMode={true}
            />
          </div>
        </div>
      )}
      
      {/* Save Outfit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Outfit</DialogTitle>
            <DialogDescription>
              Give your outfit a name and select a type to save it to your collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="outfitName">Outfit Name</Label>
              <Input
                id="outfitName"
                placeholder="e.g., Summer Casual"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="outfitType">Outfit Type</Label>
              <Select value={outfitType} onValueChange={setOutfitType}>
                <SelectTrigger id="outfitType">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {outfitTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Preview:</h4>
              <div className="grid grid-cols-5 gap-1 border rounded-md p-2 bg-muted/10">
                {selectedItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="aspect-square rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {selectedItems.length > 5 && (
                  <div className="aspect-square rounded bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">+{selectedItems.length - 5}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Outfit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutfitBuilder;
