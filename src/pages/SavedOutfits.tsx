import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { getSavedOutfits, searchOutfits, SavedOutfit } from '@/services/outfitService';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Filter, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteOutfit } from '@/services/outfitService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/UI/alert-dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Fetch saved outfits
  const { data: outfits, isLoading, refetch } = useQuery({
    queryKey: ['savedOutfits', user?.id],
    queryFn: getSavedOutfits,
    enabled: !!user,
  });
  
  // Filter outfits based on search term and type
  const filteredOutfits = outfits?.filter(outfit => {
    const matchesSearch = outfit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || outfit.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];
  
  const handleViewOutfit = (outfit) => {
    setSelectedOutfit(outfit);
    setViewDialogOpen(true);
  };
  
  const handleDeleteOutfit = async (outfitId) => {
    try {
      // Call delete API
      await deleteOutfit(outfitId);
      refetch();
      toast({
        title: "Success",
        description: "Outfit deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete outfit.",
        variant: "destructive",
      });
    }
  };
  
  const handleTryOutfit = () => {
    // Navigate to outfit builder with selected outfit
    navigate('/explore', { state: { selectedOutfit } });
    setViewDialogOpen(false);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Saved Outfits</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search outfits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
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
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOutfits.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredOutfits.map((outfit) => (
                <motion.div
                  key={outfit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={outfit.preview_image || '/placeholder-outfit.jpg'} 
                        alt={outfit.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardHeader className="flex-grow">
                      <CardTitle>{outfit.name}</CardTitle>
                      <CardDescription>
                        <span className="inline-block px-2 py-1 bg-muted rounded-full text-xs capitalize">
                          {outfit.type}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOutfit(outfit)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteOutfit(outfit.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No outfits found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || typeFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Create your first outfit in the Outfit Builder"}
            </p>
            <Button 
              onClick={() => navigate('/explore')} 
              className="mt-4"
            >
              Create an Outfit
            </Button>
          </div>
        )}
        
        {/* View Outfit Dialog */}
        {selectedOutfit && (
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedOutfit.name}</DialogTitle>
                <DialogDescription>
                  <span className="inline-block px-2 py-1 bg-muted rounded-full text-xs capitalize">
                    {selectedOutfit.type}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                {selectedOutfit.items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleTryOutfit}>
                  Try This Outfit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default SavedOutfits; 