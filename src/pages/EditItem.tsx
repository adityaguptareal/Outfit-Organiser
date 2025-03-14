import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getWardrobeItem, updateWardrobeItem } from '@/services/wardrobeService';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [item, setItem] = useState<ClothingItemProps | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getWardrobeItem(id!);
        setItem(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load item details.",
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
    if (!item) return;

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
        description: "Item updated successfully.",
      });
      navigate('/wardrobe');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item.",
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

  if (!item) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold">Item not found</h2>
          <p className="text-muted-foreground mt-2">The item you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/wardrobe')} className="mt-4">
            Back to Wardrobe
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Item</h1>
          <p className="text-muted-foreground mt-1">Update your clothing item details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
          {/* Image Preview - Left side on medium screens and up, top on small screens */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted border border-border">
                {!imageError ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Note: To change the image, you'll need to upload a new item.
              </p>
            </div>
          </div>

          {/* Form Fields - Right side on medium screens and up, bottom on small screens */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={item.category}
                  onValueChange={(value) => setItem({ ...item, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="bottoms">Bottoms</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={item.color}
                  onChange={(e) => setItem({ ...item, color: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="purchaseLink">Purchase Link (Optional)</Label>
                <Input
                  id="purchaseLink"
                  type="url"
                  value={item.purchaseLink || ''}
                  onChange={(e) => setItem({ ...item, purchaseLink: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditItem; 