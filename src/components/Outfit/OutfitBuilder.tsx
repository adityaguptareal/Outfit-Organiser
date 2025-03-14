
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlusCircle, Shirt, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';

interface OutfitBuilderProps {
  className?: string;
}

interface OutfitSlot {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
  empty: boolean;
  image?: string;
}

const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ className }) => {
  const [outfitSlots, setOutfitSlots] = useState<OutfitSlot[]>([
    { id: '1', name: 'Top', type: 'top', empty: true },
    { id: '2', name: 'Bottom', type: 'bottom', empty: true },
    { id: '3', name: 'Shoes', type: 'shoes', empty: true },
    { id: '4', name: 'Accessory', type: 'accessory', empty: true },
  ]);

  // Mock function to simulate adding an item to a slot
  const handleAddItem = (slotId: string) => {
    // In a real app, this would open a selection modal
    // For demo purposes, we'll just update with mock data
    const mockItems: Record<string, { name: string; image: string }> = {
      '1': { 
        name: 'White Button Down Shirt',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=500&auto=format&fit=crop'
      },
      '2': {
        name: 'Black Slim Jeans',
        image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=500&auto=format&fit=crop'
      },
      '3': {
        name: 'Leather Oxford Shoes',
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=500&auto=format&fit=crop'
      },
      '4': {
        name: 'Watch',
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=500&auto=format&fit=crop'
      },
    };

    setOutfitSlots(prev => 
      prev.map(slot => 
        slot.id === slotId
          ? { ...slot, empty: false, ...mockItems[slotId] }
          : slot
      )
    );
  };

  // Mock function to get AI recommendations
  const handleGetRecommendations = () => {
    // In a real app, this would call an AI API
    console.log('Getting AI recommendations...');
  };

  return (
    <div className={cn('space-y-6', className)}>
      <GlassmorphicContainer className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold tracking-tight">Outfit Builder</h3>
          <Button 
            variant="outline"
            className="flex items-center space-x-2"
            onClick={handleGetRecommendations}
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
                      >
                        Change
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {!slot.empty && (
                <p className="mt-2 text-xs text-center truncate max-w-full">{slot.name}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline">Save Outfit</Button>
          <Button>
            <Shirt size={16} className="mr-2" />
            Complete Outfit
          </Button>
        </div>
      </GlassmorphicContainer>
    </div>
  );
};

export default OutfitBuilder;
