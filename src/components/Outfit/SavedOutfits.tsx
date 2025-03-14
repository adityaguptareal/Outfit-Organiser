import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Loader2, Search, Filter, Eye, Trash2, Calendar, Tag, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for saved outfits
// In a real app, this would come from a database
interface SavedOutfit {
  id: string;
  name: string;
  type: string;
  created_at: string;
  items: ClothingItemProps[];
}

const mockOutfits: SavedOutfit[] = [
  {
    id: '1',
    name: 'Summer Casual',
    type: 'casual',
    created_at: '2023-06-15',
    items: [
      {
        id: 'top1',
        name: 'White T-Shirt',
        category: 'tops',
        color: 'white',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format',
        isFavorite: false,
      },
      {
        id: 'bottom1',
        name: 'Blue Jeans',
        category: 'bottoms',
        color: 'blue',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
        isFavorite: false,
      },
      {
        id: 'footwear1',
        name: 'White Sneakers',
        category: 'footwear',
        color: 'white',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format',
        isFavorite: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Business Meeting',
    type: 'formal',
    created_at: '2023-07-20',
    items: [
      {
        id: 'top2',
        name: 'Blue Dress Shirt',
        category: 'tops',
        color: 'blue',
        image: 'https://images.unsplash.com/photo-1603252109612-24fa03d145c8?w=500&auto=format',
        isFavorite: false,
      },
      {
        id: 'bottom2',
        name: 'Black Dress Pants',
        category: 'bottoms',
        color: 'black',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format',
        isFavorite: false,
      },
      {
        id: 'footwear2',
        name: 'Black Dress Shoes',
        category: 'footwear',
        color: 'black',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format',
        isFavorite: false,
      },
    ],
  },
];

const outfitTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'business', label: 'Business' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' }
];

const SavedOutfits: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // In a real app, this would fetch from an API
  const { data: outfits, isLoading } = useQuery({
    queryKey: ['savedOutfits', user?.id],
    queryFn: () => Promise.resolve(mockOutfits),
    enabled: !!user,
  });
  
  // Filter outfits based on search term and type
  const filteredOutfits = outfits?.filter(outfit => {
    const matchesSearch = outfit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || outfit.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];
  
  const handleViewOutfit = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit);
    setViewDialogOpen(true);
  };
  
  const handleTryOutfit = () => {
    if (!selectedOutfit) return;
    
    // Navigate to outfit builder with selected outfit
    navigate('/explore', { 
      state: { 
        activeTab: 'builder',
        preselectedOutfit: {
          ...selectedOutfit,
          items: selectedOutfit.items
        } 
      } 
    });
    setViewDialogOpen(false);
  };
  
  const handleDeleteOutfit = (outfitId: string) => {
    // In a real app, this would call an API
    toast({
      title: "Outfit Deleted",
      description: "The outfit has been removed from your collection.",
    });
    
    // Mock deletion by filtering out the outfit
    queryClient.setQueryData(['savedOutfits', user?.id], (oldData: SavedOutfit[] | undefined) => 
      oldData ? oldData.filter(outfit => outfit.id !== outfitId) : []
    );
  };
  
  // Get a preview image for the outfit (first item's image)
  const getOutfitPreviewImage = (outfit: SavedOutfit) => {
    return outfit.items[0]?.image || 'https://via.placeholder.com/300?text=No+Image';
  };
  
  // Group items by category
  const getItemsByCategory = (items: ClothingItemProps[]) => {
    const categories = ['tops', 'bottoms', 'footwear', 'accessories'];
    const result: Record<string, ClothingItemProps[]> = {};
    
    categories.forEach(category => {
      result[category] = items.filter(item => item.category === category);
    });
    
    return result;
  };
  
  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search outfits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
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
      
      {/* Outfits Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading your outfits...</p>
        </div>
      ) : filteredOutfits.length > 0 ? (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOutfits.map((outfit) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={getOutfitPreviewImage(outfit)} 
                      alt={outfit.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <Badge className="absolute bottom-3 left-3 capitalize bg-primary/90 hover:bg-primary">
                      {outfit.type}
                    </Badge>
                  </div>
                  <CardHeader className="flex-grow p-4 pb-2">
                    <CardTitle className="text-lg font-semibold">{outfit.name}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {outfit.created_at}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between p-4 pt-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="flex-1 mr-2"
                      onClick={() => handleViewOutfit(outfit)}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteOutfit(outfit.id)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No outfits found</h3>
            <p className="text-muted-foreground mb-6 px-4">
              {searchTerm || typeFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Create your first outfit in the Outfit Builder"}
            </p>
            <Button 
              onClick={() => navigate('/explore', { state: { activeTab: 'builder' } })} 
              className="group"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create an Outfit
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Button>
          </div>
        </div>
      )}
      
      {/* View Outfit Dialog */}
      {selectedOutfit && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedOutfit.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {selectedOutfit.type}
                </Badge>
                <span className="text-xs flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedOutfit.created_at}
                </span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-2 max-h-[60vh] overflow-y-auto">
              {Object.entries(getItemsByCategory(selectedOutfit.items)).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-medium capitalize flex items-center">
                      <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {items.map((item) => (
                        <div key={item.id} className="space-y-2 group">
                          <div className="aspect-square rounded-md overflow-hidden bg-muted relative">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Badge className="capitalize bg-white/90 text-black hover:bg-white/100">
                                {item.color}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="sm:mr-2 order-2 sm:order-1">
                Close
              </Button>
              <Button onClick={handleTryOutfit} className="order-1 sm:order-2">
                Try This Outfit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SavedOutfits;
