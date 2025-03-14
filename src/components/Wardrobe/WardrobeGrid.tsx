
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClothingItem, { ClothingItemProps } from './ClothingItem';
import { cn } from '@/lib/utils';

// Mock clothing data
const MOCK_CLOTHING_ITEMS: ClothingItemProps[] = [
  {
    id: '1',
    name: 'White Button Down Shirt',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=500&auto=format&fit=crop',
    category: 'Tops',
    color: 'white',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Navy Blue Blazer',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=500&auto=format&fit=crop',
    category: 'Outerwear',
    color: 'navy',
  },
  {
    id: '3',
    name: 'Black Slim Jeans',
    image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=500&auto=format&fit=crop',
    category: 'Bottoms',
    color: 'black',
  },
  {
    id: '4',
    name: 'Leather Oxford Shoes',
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=500&auto=format&fit=crop',
    category: 'Footwear',
    color: 'brown',
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Cashmere Sweater',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=500&auto=format&fit=crop',
    category: 'Tops',
    color: 'gray',
  },
  {
    id: '6',
    name: 'Khaki Chinos',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=500&auto=format&fit=crop',
    category: 'Bottoms',
    color: 'beige',
  },
  {
    id: '7',
    name: 'Denim Jacket',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop',
    category: 'Outerwear',
    color: 'blue',
  },
  {
    id: '8',
    name: 'White Sneakers',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=500&auto=format&fit=crop',
    category: 'Footwear',
    color: 'white',
  },
];

const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
];

interface WardrobeGridProps {
  className?: string;
}

const WardrobeGrid: React.FC<WardrobeGridProps> = ({ className }) => {
  const filterItemsByCategory = (category: string) => {
    if (category === 'all') return MOCK_CLOTHING_ITEMS;
    return MOCK_CLOTHING_ITEMS.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap justify-start mb-6 gap-2 bg-transparent">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {filterItemsByCategory(category.id).map((item, index) => (
                <ClothingItem
                  key={item.id}
                  {...item}
                  delay={index * 100}
                  onClick={() => console.log(`Selected item: ${item.name}`)}
                />
              ))}
            </div>
            
            {filterItemsByCategory(category.id).length === 0 && (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No items in this category yet</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default WardrobeGrid;
