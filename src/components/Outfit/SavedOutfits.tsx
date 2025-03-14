import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSavedOutfits, toggleOutfitFavorite, deleteOutfit } from '@/services/outfitService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AnimatedCard from '../UI/AnimatedCard';
import { useToast } from '@/hooks/use-toast';
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

interface SavedOutfitsProps {
  className?: string;
}

const SavedOutfits: React.FC<SavedOutfitsProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteOutfitId, setDeleteOutfitId] = useState<string | null>(null);

  const { data: outfits, isLoading, error } = useQuery({
    queryKey: ['outfits'],
    queryFn: getSavedOutfits,
    enabled: !!user
  });

  const handleFavoriteToggle = async (id: string, isFavorite: boolean) => {
    try {
      await toggleOutfitFavorite(id, !isFavorite);
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `Outfit has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteOutfitId(id);
  };

  const confirmDelete = async () => {
    if (!deleteOutfitId) return;
    
    try {
      await deleteOutfit(deleteOutfitId);
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      toast({
        title: "Outfit deleted",
        description: "The outfit has been removed from your collection.",
      });
      setDeleteOutfitId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the outfit.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive">Error loading outfits</p>
      </div>
    );
  }

  const getCategoryLabel = (type: string | null | undefined): string => {
    if (!type) return 'Uncategorized';
    
    const categories: Record<string, string> = {
      'casual': 'Casual',
      'business': 'Business',
      'party': 'Party',
      'formal': 'Formal',
      'date': 'Date Night'
    };
    
    return categories[type] || 'Other';
  };

  return (
    <div className={cn('space-y-6', className)}>
      <GlassmorphicContainer className="p-6">
        <h3 className="text-xl font-semibold tracking-tight mb-6">Saved Outfits</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !outfits || outfits.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">You haven't saved any outfits yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {outfits.map((outfit, index) => (
              <AnimatedCard
                key={outfit.id}
                delay={index * 100}
                className="group relative"
                interactive={true}
              >
                <div className="p-4">
                  <h4 className="font-medium text-md">{outfit.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getCategoryLabel(outfit.type)}
                  </p>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {outfit.top && (
                      <div className="bg-muted rounded aspect-square">
                        <img src={outfit.top.image_url} alt={outfit.top.name} className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                    {outfit.bottom && (
                      <div className="bg-muted rounded aspect-square">
                        <img src={outfit.bottom.image_url} alt={outfit.bottom.name} className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                    {outfit.shoes && (
                      <div className="bg-muted rounded aspect-square">
                        <img src={outfit.shoes.image_url} alt={outfit.shoes.name} className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                    {outfit.accessory && (
                      <div className="bg-muted rounded aspect-square">
                        <img src={outfit.accessory.image_url} alt={outfit.accessory.name} className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        className="p-1.5 rounded-full bg-background/70 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {}}
                        title="Edit Outfit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-full bg-background/70 text-destructive hover:bg-destructive/20 transition-colors"
                        onClick={() => handleDeleteClick(outfit.id)}
                        title="Delete Outfit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <button
                      className={cn(
                        "p-1.5 rounded-full transition-all duration-300",
                        outfit.is_favorite ? "bg-red-500/90 text-white" : "bg-background/70 text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => handleFavoriteToggle(outfit.id, !!outfit.is_favorite)}
                      title={outfit.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={14} className={outfit.is_favorite ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </GlassmorphicContainer>

      <AlertDialog open={!!deleteOutfitId} onOpenChange={(open) => !open && setDeleteOutfitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this outfit from your collection.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedOutfits;
