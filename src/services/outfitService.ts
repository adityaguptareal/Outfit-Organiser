
import { supabase } from '@/integrations/supabase/client';

export interface Outfit {
  id: string;
  name: string;
  occasion?: string;
  season?: string;
  items: string[];
  is_favorite: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Get all outfits for the current user
export const getOutfits = async (): Promise<Outfit[]> => {
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching outfits:', error);
    throw error;
  }

  return data;
};

// Add a new outfit
export const addOutfit = async (
  name: string,
  items: string[],
  occasion?: string,
  season?: string
): Promise<Outfit> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to add an outfit');
  }

  const { data, error } = await supabase
    .from('outfits')
    .insert({
      name,
      items,
      occasion,
      season,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding outfit:', error);
    throw error;
  }

  return data;
};

// Toggle favorite status for an outfit
export const toggleOutfitFavorite = async (id: string, isFavorite: boolean): Promise<void> => {
  const { error } = await supabase
    .from('outfits')
    .update({ is_favorite: isFavorite })
    .eq('id', id);

  if (error) {
    console.error('Error updating outfit favorite status:', error);
    throw error;
  }
};

// Delete an outfit
export const deleteOutfit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('outfits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting outfit:', error);
    throw error;
  }
};
