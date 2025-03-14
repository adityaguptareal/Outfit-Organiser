
import { supabase } from '@/integrations/supabase/client';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  image_url: string;
  is_favorite: boolean;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Get all wardrobe items for the current user
export const getWardrobeItems = async (): Promise<ClothingItemProps[]> => {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wardrobe items:', error);
    throw error;
  }

  return data.map((item: WardrobeItem) => ({
    id: item.id,
    name: item.name,
    image: item.image_url,
    category: item.category,
    color: item.color,
    isFavorite: item.is_favorite,
  }));
};

// Get wardrobe items by category
export const getWardrobeItemsByCategory = async (category: string): Promise<ClothingItemProps[]> => {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${category} items:`, error);
    throw error;
  }

  return data.map((item: WardrobeItem) => ({
    id: item.id,
    name: item.name,
    image: item.image_url,
    category: item.category,
    color: item.color,
    isFavorite: item.is_favorite,
  }));
};

// Add a new wardrobe item
export const addWardrobeItem = async (
  name: string,
  category: string,
  color: string,
  imageFile: File
): Promise<WardrobeItem> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to add a wardrobe item');
  }

  // First, upload the image to storage
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('wardrobe')
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  // Get the public URL for the uploaded image
  const { data: publicURL } = supabase.storage
    .from('wardrobe')
    .getPublicUrl(filePath);

  // Now, add the item to the database
  const { data, error } = await supabase
    .from('wardrobe_items')
    .insert({
      name,
      category,
      color,
      image_url: publicURL.publicUrl,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding wardrobe item:', error);
    throw error;
  }

  return data;
};

// Toggle favorite status for an item
export const toggleFavorite = async (id: string, isFavorite: boolean): Promise<void> => {
  const { error } = await supabase
    .from('wardrobe_items')
    .update({ is_favorite: isFavorite })
    .eq('id', id);

  if (error) {
    console.error('Error updating favorite status:', error);
    throw error;
  }
};

// Delete a wardrobe item
export const deleteWardrobeItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('wardrobe_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting wardrobe item:', error);
    throw error;
  }
};
