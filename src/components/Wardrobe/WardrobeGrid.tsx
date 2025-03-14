
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClothingItem, { ClothingItemProps } from './ClothingItem';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWardrobeItems, getWardrobeItemsByCategory } from '@/services/wardrobeService';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  onSelectItem?: (item: ClothingItemProps) => void;
  selectionMode?: boolean;
  categoryFilter?: string;
}

const WardrobeGrid: React.FC<WardrobeGridProps> = ({ 
  className, 
  onSelectItem, 
  selectionMode = false,
  categoryFilter
}) => {
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'all');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set activeCategory when categoryFilter prop changes
  useEffect(() => {
    if (categoryFilter) {
      setActiveCategory(categoryFilter);
    }
  }, [categoryFilter]);

  const { data: allItems, isLoading, error } = useQuery({
    queryKey: ['wardrobeItems', user?.id],
    queryFn: getWardrobeItems,
    enabled: !!user,
  });

  const filterItemsByCategory = (category: string) => {
    if (!allItems) return [];
    if (category === 'all') return allItems;
    return allItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  const handleItemClick = (item: ClothingItemProps) => {
    if (onSelectItem) {
      onSelectItem(item);
    } else {
      console.log(`Selected item: ${item.name}`);
    }
  };

  const handleItemDelete = () => {
    // Invalidate the query to refresh the data
    queryClient.invalidateQueries({ queryKey: ['wardrobeItems', user?.id] });
  };

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-destructive">Error loading wardrobe items</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {!categoryFilter && (
        <Tabs 
          value={activeCategory} 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
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
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {filterItemsByCategory(category.id).map((item, index) => (
                    <ClothingItem
                      key={item.id}
                      {...item}
                      delay={index * 100}
                      onClick={() => handleItemClick(item)}
                      onDelete={handleItemDelete}
                    />
                  ))}
                </div>
                
                {filterItemsByCategory(category.id).length === 0 && (
                  <div className="py-16 text-center flex flex-col items-center gap-4">
                    <p className="text-muted-foreground">
                      {allItems && allItems.length > 0 
                        ? 'No items in this category yet' 
                        : 'Your wardrobe is empty. Upload some items to get started!'}
                    </p>
                    <Button asChild>
                      <Link to="/upload">
                        <Plus size={16} className="mr-2" />
                        Add Item
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))
          )}
        </Tabs>
      )}

      {categoryFilter && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {filterItemsByCategory(categoryFilter).map((item, index) => (
                  <ClothingItem
                    key={item.id}
                    {...item}
                    delay={index * 100}
                    onClick={() => handleItemClick(item)}
                    onDelete={handleItemDelete}
                  />
                ))}
              </div>
              
              {filterItemsByCategory(categoryFilter).length === 0 && (
                <div className="py-16 text-center flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">
                    No items in this category yet
                  </p>
                  <Button asChild>
                    <Link to="/upload">
                      <Plus size={16} className="mr-2" />
                      Add Item
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WardrobeGrid;
