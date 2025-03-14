import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';
import { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';

type Tables = Database['public']['Tables'];
type OutfitRow = Tables['outfits']['Row'];
type OutfitInsert = Tables['outfits']['Insert'];
type WardrobeItem = Tables['wardrobe_items']['Row'];

export type OutfitItem = Omit<WardrobeItem, 'user_id' | 'created_at' | 'updated_at'>;

export interface SavedOutfit extends OutfitRow {
  top?: OutfitItem;
  bottom?: OutfitItem;
  shoes?: OutfitItem;
  accessory?: OutfitItem;
}

export interface Outfit {
  id: string;
  name: string;
  type: string;
  user_id: string;
  preview_image?: string;
  created_at: string;
  items: ClothingItemProps[];
}

// Save a new outfit
export const saveOutfit = async (
  name: string,
  type: string,
  items: {
    top_id: string;
    bottom_id: string;
    shoes_id: string;
    accessory_id?: string;
  }
): Promise<SavedOutfit> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to save outfits');
  }

  const outfitData: OutfitInsert = {
    name,
    type,
    top_id: items.top_id,
    bottom_id: items.bottom_id,
    shoes_id: items.shoes_id,
    accessory_id: items.accessory_id,
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('outfits')
    .insert(outfitData)
    .select(`
      id,
      name,
      type,
      top_id,
      bottom_id,
      shoes_id,
      accessory_id,
      user_id,
      created_at,
      updated_at,
      top:wardrobe_items!top_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      bottom:wardrobe_items!bottom_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      shoes:wardrobe_items!shoes_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      accessory:wardrobe_items!accessory_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as SavedOutfit;
};

// Get all saved outfits for the current user
export const getSavedOutfits = async (): Promise<SavedOutfit[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to fetch outfits');
  }

  const { data, error } = await supabase
    .from('outfits')
    .select(`
      id,
      name,
      type,
      top_id,
      bottom_id,
      shoes_id,
      accessory_id,
      user_id,
      created_at,
      updated_at,
      top:wardrobe_items!top_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      bottom:wardrobe_items!bottom_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      shoes:wardrobe_items!shoes_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      accessory:wardrobe_items!accessory_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as SavedOutfit[];
};

// Search saved outfits
export const searchOutfits = async (query: string): Promise<SavedOutfit[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to search outfits');
  }

  const { data, error } = await supabase
    .from('outfits')
    .select(`
      id,
      name,
      type,
      top_id,
      bottom_id,
      shoes_id,
      accessory_id,
      user_id,
      created_at,
      updated_at,
      top:wardrobe_items!top_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      bottom:wardrobe_items!bottom_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      shoes:wardrobe_items!shoes_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      ),
      accessory:wardrobe_items!accessory_id(
        id,
        name,
        image_url,
        category,
        color,
        purchase_link,
        is_favorite
      )
    `)
    .eq('user_id', user.id)
    .or(`name.ilike.%${query}%,type.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as SavedOutfit[];
};

// Delete a saved outfit
export const deleteOutfit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('outfits')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

// Toggle favorite status of an outfit
export const toggleOutfitFavorite = async (id: string, isFavorite: boolean): Promise<void> => {
  const { error } = await supabase
    .from('outfits')
    .update({ is_favorite: isFavorite })
    .eq('id', id);

  if (error) {
    throw error;
  }
};

// Get AI suggestions for outfit items
export const getAISuggestions = async (
  category: string,
  currentItems: Record<string, ClothingItemProps | null>
): Promise<ClothingItemProps | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to get AI suggestions');
  }
  
  // In a real implementation, this would call an AI service
  // For now, we'll just fetch a random item from the user's wardrobe in that category
  
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('category', category)
    .eq('user_id', user.id)
    .order('random()')
    .limit(1);

  if (error) {
    throw error;
  }

  return data[0] as ClothingItemProps;
};
