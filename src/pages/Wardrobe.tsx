
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import WardrobeGrid from '@/components/Wardrobe/WardrobeGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Wardrobe: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Wardrobe</h1>
            <p className="text-muted-foreground mt-1">Browse and manage your clothing items</p>
          </div>
          <Button asChild>
            <Link to="/upload">
              <Plus size={16} className="mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
        
        <WardrobeGrid />
      </div>
    </MainLayout>
  );
};

export default Wardrobe;
