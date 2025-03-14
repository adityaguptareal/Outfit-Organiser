import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ClothingItem, { ClothingItemProps } from './ClothingItem';
import { useQuery } from '@tanstack/react-query';
import { getWardrobeItems } from '@/services/wardrobeService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Define categories
const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
];

export interface WardrobeGridProps {
  items?: ClothingItemProps[];
  categoryFilter?: string;
  onSelectItem?: (item: ClothingItemProps) => void;
  selectionMode?: boolean;
  className?: string;
  isLoading?: boolean;
}

const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items: propItems,
  categoryFilter: propCategoryFilter = 'all',
  onSelectItem,
  selectionMode = false,
  className,
  isLoading: propIsLoading = false,
}) => {
  const [categoryFilter, setCategoryFilter] = useState(propCategoryFilter);
  const { user } = useAuth();

  // Fetch items if not provided as props
  const { data: fetchedItems, isLoading: isQueryLoading, refetch } = useQuery({
    queryKey: ['wardrobeItems', user?.id],
    queryFn: getWardrobeItems,
    enabled: !propItems && !!user,
  });

  const items = propItems || fetchedItems || [];
  const isLoading = propIsLoading || isQueryLoading;

  const handleItemDelete = () => {
    // Invalidate the query to refetch items
    refetch();
  };

  // Filter items based on category
  const filteredItems = items.filter(item => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'favorites') return item.isFavorite;
    return item.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Category filter buttons - fixed height to prevent layout shift */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={categoryFilter === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(category.id)}
            className="rounded-full"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Container with minimum height to prevent layout collapse */}
      <div className="min-h-[300px]">
        {isLoading ? (
          // Show placeholder items when loading
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          // Show actual items
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
            className
          )}>
            {filteredItems.map(item => (
              <ClothingItem
                key={item.id}
                {...item}
                onSelect={onSelectItem}
                onDelete={handleItemDelete}
                selectionMode={selectionMode}
              />
            ))}
          </div>
        ) : (
          // Show empty state
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {categoryFilter === 'all' 
                ? "No items in your wardrobe yet." 
                : categoryFilter === 'favorites'
                  ? "No favorite items yet. Click the heart icon on items to add them to favorites."
                  : `No ${categoryFilter} in your wardrobe yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardrobeGrid;
