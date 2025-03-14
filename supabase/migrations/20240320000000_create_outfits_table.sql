-- Create outfits table
CREATE TABLE outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  top_id UUID NOT NULL REFERENCES wardrobe_items(id),
  bottom_id UUID NOT NULL REFERENCES wardrobe_items(id),
  shoes_id UUID NOT NULL REFERENCES wardrobe_items(id),
  accessory_id UUID REFERENCES wardrobe_items(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own outfits
CREATE POLICY "Users can view their own outfits"
  ON outfits FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own outfits
CREATE POLICY "Users can insert their own outfits"
  ON outfits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own outfits
CREATE POLICY "Users can update their own outfits"
  ON outfits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own outfits
CREATE POLICY "Users can delete their own outfits"
  ON outfits FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON outfits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 