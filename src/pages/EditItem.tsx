import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getWardrobeItems, updateWardrobeItem } from '@/services/wardrobeService';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [item, setItem] = useState({
    name: '',
    category: '',
    color: '',
    purchaseLink: '',
    image: '',
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const items = await getWardrobeItems();
        const foundItem = items.find(i => i.id === id);
        if (foundItem) {
          setItem({
            name: foundItem.name,
            category: foundItem.category,
            color: foundItem.color,
            purchaseLink: foundItem.purchaseLink || '',
            image: foundItem.image,
          });
        } else {
          toast({
            title: "Error",
            description: "Item not found",
            variant: "destructive",
          });
          navigate('/wardrobe');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load item details",
          variant: "destructive",
        });
        navigate('/wardrobe');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateWardrobeItem(id!, {
        name: item.name,
        category: item.category,
        color: item.color,
        purchase_link: item.purchaseLink,
      });

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      navigate('/wardrobe');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Item</h1>
          <p className="text-muted-foreground mt-1">Update your clothing item details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Preview Section */}
          <div className="space-y-4">
            <Label>Item Image</Label>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Image cannot be changed in edit mode. To change the image, please delete this item and create a new one.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={item.category}
                onChange={(e) => setItem({ ...item, category: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={item.color}
                onChange={(e) => setItem({ ...item, color: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseLink">Purchase Link (Optional)</Label>
              <Input
                id="purchaseLink"
                value={item.purchaseLink}
                onChange={(e) => setItem({ ...item, purchaseLink: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/wardrobe')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditItem; 