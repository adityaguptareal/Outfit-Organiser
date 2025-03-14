
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlusCircle, Shirt, Sparkles, Upload, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WardrobeGrid from '../Wardrobe/WardrobeGrid';
import { Link } from 'react-router-dom';
import { ClothingItemProps } from '../Wardrobe/ClothingItem';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { addOutfit } from '@/services/outfitService';

interface OutfitBuilderProps {
  className?: string;
}

type OutfitCategory = 'casual' | 'business' | 'party' | 'formal' | 'date';

interface OutfitSlot {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
  empty: boolean;
  itemId?: string;
  image?: string;
  itemName?: string;
}

const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<string>('top');
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [outfitCategory, setOutfitCategory] = useState<OutfitCategory>('casual');
  const [currentSlot, setCurrentSlot] = useState<string>('');
  const { toast } = useToast();

  const [outfitSlots, setOutfitSlots] = useState<OutfitSlot[]>([
    { id: '1', name: 'Top', type: 'top', empty: true },
    { id: '2', name: 'Bottom', type: 'bottom', empty: true },
    { id: '3', name: 'Shoes', type: 'shoes', empty: true },
    { id: '4', name: 'Accessory', type: 'accessory', empty: true },
  ]);

  const handleAddItem = (slotId: string) => {
    setCurrentSlot(slotId);
    setIsSelectionModalOpen(true);
    
    // Set the active tab based on the slot
    const slot = outfitSlots.find(s => s.id === slotId);
    if (slot) {
      setActiveTab(slot.type);
    }
  };

  const handleItemSelected = (item: ClothingItemProps) => {
    setOutfitSlots(prev => 
      prev.map(slot => 
        slot.id === currentSlot
          ? { 
              ...slot, 
              empty: false, 
              itemId: item.id,
              image: item.image,
              itemName: item.name
            }
          : slot
      )
    );
    setIsSelectionModalOpen(false);
  };

  const isOutfitComplete = () => {
    return outfitSlots.every(slot => !slot.empty);
  };

  const handleSaveOutfit = async () => {
    if (!outfitName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your outfit.",
        variant: "destructive",
      });
      return;
    }

    try {
      const itemIds = outfitSlots
        .filter(slot => !slot.empty && slot.itemId)
        .map(slot => slot.itemId as string);

      await addOutfit(outfitName, itemIds, outfitCategory);
      
      toast({
        title: "Outfit saved",
        description: `${outfitName} has been added to your outfits.`
      });
      
      setIsSaveModalOpen(false);
      setOutfitName('');
      
      // Reset the outfit slots
      setOutfitSlots(prev => 
        prev.map(slot => ({ ...slot, empty: true, itemId: undefined, image: undefined, itemName: undefined }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save outfit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <GlassmorphicContainer className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold tracking-tight">Outfit Builder</h3>
          <Button 
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => {}}
          >
            <Sparkles size={16} />
            <span>AI Suggestions</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {outfitSlots.map((slot) => (
            <div 
              key={slot.id}
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "relative rounded-lg overflow-hidden aspect-square w-full",
                  slot.empty ? "bg-muted border-2 border-dashed border-muted-foreground/30" : "bg-background border border-border"
                )}
              >
                {slot.empty ? (
                  <button 
                    className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                    onClick={() => handleAddItem(slot.id)}
                  >
                    <PlusCircle size={24} className="mb-2" />
                    <span className="text-sm font-medium">{slot.name}</span>
                  </button>
                ) : (
                  <>
                    <img 
                      src={slot.image} 
                      alt={slot.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-background/60 backdrop-blur-sm">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleAddItem(slot.id)}
                      >
                        Change
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {!slot.empty && slot.itemName && (
                <p className="mt-2 text-xs text-center truncate max-w-full">{slot.itemName}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={() => setOutfitSlots(prev => 
              prev.map(slot => ({ ...slot, empty: true, itemId: undefined, image: undefined, itemName: undefined }))
            )}
          >
            Clear All
          </Button>
          <Button 
            disabled={!isOutfitComplete()}
            onClick={() => setIsSaveModalOpen(true)}
          >
            <Shirt size={16} className="mr-2" />
            Complete Outfit
          </Button>
        </div>
      </GlassmorphicContainer>

      {/* Item Selection Modal */}
      <Dialog open={isSelectionModalOpen} onOpenChange={setIsSelectionModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select a {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
            <DialogDescription>
              Choose from your wardrobe or upload a new item
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center space-x-4 my-4">
            <Button 
              variant="outline" 
              asChild
              onClick={() => setIsSelectionModalOpen(false)}
            >
              <Link to="/upload">
                <Upload size={16} className="mr-2" />
                Upload New
              </Link>
            </Button>
            <Button>
              <Grid2X2 size={16} className="mr-2" />
              Pick from Wardrobe
            </Button>
          </div>

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="top">Tops</TabsTrigger>
              <TabsTrigger value="bottom">Bottoms</TabsTrigger>
              <TabsTrigger value="shoes">Shoes</TabsTrigger>
              <TabsTrigger value="accessory">Accessories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="top">
              <WardrobeGrid 
                categoryFilter="tops" 
                onSelectItem={handleItemSelected}
                selectionMode={true}
              />
            </TabsContent>
            
            <TabsContent value="bottom">
              <WardrobeGrid 
                categoryFilter="bottoms" 
                onSelectItem={handleItemSelected}
                selectionMode={true}
              />
            </TabsContent>
            
            <TabsContent value="shoes">
              <WardrobeGrid 
                categoryFilter="footwear" 
                onSelectItem={handleItemSelected}
                selectionMode={true}
              />
            </TabsContent>
            
            <TabsContent value="accessory">
              <WardrobeGrid 
                categoryFilter="accessories" 
                onSelectItem={handleItemSelected}
                selectionMode={true}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Save Outfit Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Outfit</DialogTitle>
            <DialogDescription>
              Give your outfit a name and category to save it
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="outfitName" className="text-right">
                Name
              </Label>
              <Input
                id="outfitName"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="col-span-3"
                placeholder="Summer Weekend"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={outfitCategory} 
                onValueChange={(value) => setOutfitCategory(value as OutfitCategory)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="date">Date Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSaveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveOutfit}>Save Outfit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutfitBuilder;
