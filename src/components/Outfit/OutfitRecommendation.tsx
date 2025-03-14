
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';
import { Button } from '@/components/ui/button';
import AnimatedCard from '../UI/AnimatedCard';

interface OutfitProps {
  id: string;
  title: string;
  occasion: string;
  time: string;
  items: {
    id: string;
    name: string;
    image: string;
  }[];
}

const mockOutfits: OutfitProps[] = [
  {
    id: '1',
    title: 'Business Meeting',
    occasion: 'Work',
    time: 'Morning',
    items: [
      {
        id: '1',
        name: 'White Button Down Shirt',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: '3',
        name: 'Black Slim Jeans',
        image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: '4',
        name: 'Leather Oxford Shoes',
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: '2',
    title: 'Casual Friday',
    occasion: 'Casual',
    time: 'Afternoon',
    items: [
      {
        id: '5',
        name: 'Cashmere Sweater',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: '6',
        name: 'Khaki Chinos',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: '8',
        name: 'White Sneakers',
        image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
];

interface OutfitRecommendationProps {
  className?: string;
}

const OutfitRecommendation: React.FC<OutfitRecommendationProps> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Recommended Outfits</h2>
          <p className="text-muted-foreground mt-1">Personalized outfit suggestions based on your wardrobe</p>
        </div>
        <Button className="group">
          View All 
          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockOutfits.map((outfit, index) => (
          <AnimatedCard
            key={outfit.id}
            className="overflow-hidden border"
            delay={index * 150}
            interactive
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{outfit.title}</h3>
                  <div className="flex items-center space-x-4 mt-1.5">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar size={14} className="mr-1" />
                      {outfit.occasion}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      {outfit.time}
                    </div>
                  </div>
                </div>
                <GlassmorphicContainer className="p-1.5 text-primary">
                  <Sparkles size={16} />
                </GlassmorphicContainer>
              </div>
              
              <div className="flex gap-2 mt-4">
                {outfit.items.map((item) => (
                  <div key={item.id} className="relative aspect-square w-24 h-24 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-5 py-3 bg-muted/30 flex justify-between items-center">
              <span className="text-sm font-medium">{outfit.items.length} items</span>
              <Button variant="outline" size="sm" className="h-8">
                Try Outfit
              </Button>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
};

export default OutfitRecommendation;
