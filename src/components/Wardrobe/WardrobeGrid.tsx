import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClothingItem, { ClothingItemProps } from './ClothingItem';
import { useQuery } from '@tanstack/react-query';
import { getWardrobeItems } from '@/services/wardrobeService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Filter, Loader2, Plus, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/UI/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Define categories
const categories = [
  { id: 'all', label: 'All Items', icon: '👕' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
  { id: 'tops', label: 'Tops', icon: '👚' },
  { id: 'bottoms', label: 'Bottoms', icon: '👖' },
  { id: 'footwear', label: 'Footwear', icon: '👟' },
  { id: 'accessories', label: 'Accessories', icon: '👜' },
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
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter items based on category and search term
  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter === 'all' 
      ? true 
      : categoryFilter === 'favorites' 
        ? item.isFavorite 
        : item.category === categoryFilter;
    
    const matchesSearch = searchTerm 
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filter: {categories.find(c => c.id === categoryFilter)?.label || 'All Items'}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh]">
              <SheetHeader className="mb-4">
                <SheetTitle>Filter Items</SheetTitle>
                <SheetDescription>
                  Select a category to filter your wardrobe items
                </SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <SheetClose key={category.id} asChild>
                    <Button
                      variant={categoryFilter === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(category.id)}
                      className="justify-start h-12"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                      {categoryFilter === category.id && (
                        <Badge className="ml-auto bg-primary-foreground text-primary">
                          Selected
                        </Badge>
                      )}
                    </Button>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Category filter buttons */}
      <div className="hidden md:flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={categoryFilter === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(category.id)}
            className="rounded-full"
          >
            <span className="mr-1.5">{category.icon}</span>
            {category.label}
            {categoryFilter === category.id && category.id !== 'all' && (
              <Badge className="ml-2 bg-primary-foreground text-primary">
                {filteredItems.length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="min-h-[300px]">
        {isLoading ? (
          // Show placeholder items when loading
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading your items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          // Show actual items
          <AnimatePresence>
            <div className={cn(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
              className
            )}>
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ClothingItem
                    {...item}
                    onSelect={onSelectItem}
                    onDelete={handleItemDelete}
                    selectionMode={selectionMode}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          // Show empty state
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="text-4xl mb-4">👕</div>
              <h3 className="text-xl font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6 px-4">
                {searchTerm 
                  ? "Try adjusting your search or filters" 
                  : categoryFilter === 'all' 
                    ? "Your wardrobe is empty. Add some items to get started!" 
                    : categoryFilter === 'favorites'
                      ? "No favorite items yet. Click the heart icon on items to add them to favorites."
                      : `No ${categoryFilter} in your wardrobe yet.`}
              </p>
              <Button 
                asChild
                className="group"
              >
                <Link to="/upload">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardrobeGrid;
