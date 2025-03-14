import { supabase } from '@/integrations/supabase/client';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  image_url: string;
  purchase_link?: string;
  is_favorite: boolean;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Get all wardrobe items for the current user
export const getWardrobeItems = async (): Promise<ClothingItemProps[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to fetch wardrobe items');
  }

  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wardrobe items:', error);
    throw error;
  }

  const mappedItems = data.map((item: WardrobeItem) => ({
    id: item.id,
    name: item.name,
    image: item.image_url,
    category: item.category,
    color: item.color,
    purchaseLink: item.purchase_link,
    isFavorite: item.is_favorite,
  }));
  return mappedItems;
};

// Get wardrobe items by category
export const getWardrobeItemsByCategory = async (category: string): Promise<ClothingItemProps[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to fetch wardrobe items');
  }

  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${category} items:`, error);
    throw error;
  }

  const mappedItems = data.map((item: WardrobeItem) => ({
    id: item.id,
    name: item.name,
    image: item.image_url,
    category: item.category,
    color: item.color,
    purchaseLink: item.purchase_link,
    isFavorite: item.is_favorite,
  }));
  return mappedItems;
};

// Add a new wardrobe item
export const addWardrobeItem = async (
  name: string,
  category: string,
  color: string,
  imageFile: File,
  purchaseLink: string = ''
): Promise<WardrobeItem> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to add a wardrobe item');
  }

  // First, upload the image to storage
  const fileExt = imageFile.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${user.id}/${timestamp}.${fileExt}`;
  const filePath = fileName;

  // Try to upload the file directly
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('wardrobe')
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Get the public URL for the uploaded image
  const { data: publicURL } = supabase.storage
    .from('wardrobe')
    .getPublicUrl(filePath);

  if (!publicURL.publicUrl) {
    throw new Error('Failed to get public URL for uploaded image');
  }

  // Test the public URL
  try {
    const response = await fetch(publicURL.publicUrl, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Failed to access image URL: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error testing public URL:', error);
    throw error;
  }

  // Now, add the item to the database
  const itemData = {
    name,
    category,
    color,
    image_url: publicURL.publicUrl,
    purchase_link: purchaseLink,
    user_id: user.id,
    is_favorite: false
  };

  const { data, error } = await supabase
    .from('wardrobe_items')
    .insert(itemData)
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
  // First, get the item to get the image URL
  const { data: item, error: fetchError } = await supabase
    .from('wardrobe_items')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching item for deletion:', fetchError);
    throw fetchError;
  }

  // If there's an image URL, extract the file path and delete from storage
  if (item?.image_url) {
    const filePath = item.image_url.split('/').pop();
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('wardrobe')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }
  }

  // Delete the item from the database
  const { error: deleteError } = await supabase
    .from('wardrobe_items')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting wardrobe item:', deleteError);
    throw deleteError;
  }
};

// Update a wardrobe item
export const updateWardrobeItem = async (
  id: string,
  updates: {
    name?: string;
    category?: string;
    color?: string;
    purchase_link?: string;
  }
): Promise<WardrobeItem> => {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating wardrobe item:', error);
    throw error;
  }

  return data;
};
