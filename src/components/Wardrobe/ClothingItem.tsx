import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tag, Heart, ExternalLink, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import AnimatedCard from '../UI/AnimatedCard';
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
import { toggleFavorite, deleteWardrobeItem } from '@/services/wardrobeService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export interface ClothingItemProps {
  id: string;
  name: string;
  image: string;
  category: string;
  color: string;
  purchaseLink?: string;
  isFavorite?: boolean;
  delay?: number;
  onClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
  className?: string;
}

const ClothingItem: React.FC<ClothingItemProps> = ({
  id,
  name,
  image,
  category,
  color,
  purchaseLink,
  isFavorite = false,
  delay = 0,
  onClick,
  onEdit,
  onDelete,
  className,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  useEffect(() => {
    setIsImageLoaded(false);
    setImageError(false);
    setRetryCount(0);
  }, [image]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setIsImageLoaded(true);
      };
      img.onerror = () => {
        setImageError(true);
        setIsImageLoaded(true);
      };
    } else {
      setImageError(true);
      setIsImageLoaded(true);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(id, !favorite);
      setFavorite(!favorite);
      queryClient.invalidateQueries({ queryKey: ['wardrobeItems', user?.id] });
      toast({
        title: favorite ? "Removed from favorites" : "Added to favorites",
        description: `${name} has been ${favorite ? "removed from" : "added to"} your favorites.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (purchaseLink) {
      window.open(purchaseLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteWardrobeItem(id);
      setIsDeleteDialogOpen(false);
      if (onDelete) {
        onDelete();
      }
      toast({
        title: "Item deleted",
        description: `${name} has been removed from your wardrobe.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AnimatedCard 
        className={cn('group overflow-hidden', className)}
        interactive={true}
        delay={delay}
        onClick={onClick}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className={cn(
                'h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105',
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {!isImageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Tag size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium bg-background/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {purchaseLink && (
                  <button 
                    className="p-1.5 rounded-full bg-background/70 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={handlePurchaseLinkClick}
                    title="Purchase Link"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
                <button 
                  className="p-1.5 rounded-full bg-background/70 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleEditClick}
                  title="Edit Item"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  className="p-1.5 rounded-full bg-background/70 text-destructive hover:bg-destructive/20 transition-colors"
                  onClick={handleDeleteClick}
                  title="Delete Item"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  className={cn(
                    "p-1.5 rounded-full transition-all duration-300",
                    favorite ? "bg-red-500/90 text-white" : "bg-background/70 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={handleFavoriteClick}
                  title={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart size={14} className={favorite ? "fill-current" : ""} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <div className="flex items-center mt-1.5 space-x-2">
            <div 
              className="w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground">
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </span>
          </div>
        </div>
      </AnimatedCard>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {name} from your wardrobe.
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
    </>
  );
};

export default ClothingItem;
