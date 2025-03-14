import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, Pencil, Trash2, Eye } from 'lucide-react';
import { toggleFavorite, deleteWardrobeItem } from '@/services/wardrobeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/UI/badge';

export interface ClothingItemProps {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
  isFavorite?: boolean;
  onSelect?: (item: ClothingItemProps) => void;
  onDelete?: () => void;
  selectionMode?: boolean;
}

const ClothingItem: React.FC<ClothingItemProps> = ({
  id,
  name,
  category,
  color,
  image,
  isFavorite = false,
  onSelect,
  onDelete,
  selectionMode = false,
}) => {
  const queryClient = useQueryClient();

  // Toggle favorite mutation
  const { mutate: mutateFavorite } = useMutation({
    mutationFn: () => toggleFavorite(id, !isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobeItems'] });
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    },
    onError: () => {
      toast.error('Failed to update favorite status');
    },
  });

  // Delete item mutation
  const { mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteWardrobeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wardrobeItems'] });
      toast.success('Item deleted successfully');
      if (onDelete) onDelete();
    },
    onError: () => {
      toast.error('Failed to delete item');
    },
  });

  const handleSelect = () => {
    if (onSelect) {
      onSelect({ id, name, category, color, image, isFavorite });
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateFavorite();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.warning('Are you sure you want to delete this item?', {
      action: {
        label: 'Delete',
        onClick: () => mutateDelete(),
      },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative rounded-lg overflow-hidden border bg-card shadow-sm transition-all duration-200",
        selectionMode && "cursor-pointer hover:border-primary"
      )}
      onClick={selectionMode ? handleSelect : undefined}
    >
      {/* Category Badge */}
      <Badge 
        variant="secondary" 
        className="absolute top-2 left-2 z-10 opacity-90"
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>

      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
            No image
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Item Details */}
      <div className="p-3">
        <h3 className="font-medium truncate" title={name}>
          {name}
        </h3>
        <div className="flex items-center mt-1">
          <div 
            className="h-4 w-4 rounded-full mr-2" 
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-muted-foreground">
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 right-0 p-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!selectionMode && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleFavoriteToggle}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
              />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              asChild
              title="Edit item"
            >
              <Link to={`/edit/${id}`}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}
              title="Delete item"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </>
        )}
        
        {selectionMode && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleSelect}
            title="Select item"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ClothingItem;
