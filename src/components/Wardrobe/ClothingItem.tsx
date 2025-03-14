
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tag, Heart, ExternalLink } from 'lucide-react';
import AnimatedCard from '../UI/AnimatedCard';

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
  className,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
  };

  const handlePurchaseLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (purchaseLink) {
      window.open(purchaseLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatedCard 
      className={cn('group overflow-hidden', className)}
      interactive={true}
      delay={delay}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className={cn(
            'h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105',
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
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
  );
};

export default ClothingItem;
