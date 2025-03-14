
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addWardrobeItem } from '@/services/wardrobeService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
  onImagePreview?: (previewUrl: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagePreview }) => {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    // Create a preview URL for the selected image
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // Send preview URL to parent component if callback exists
      if (onImagePreview) {
        onImagePreview(objectUrl);
      }
    } else {
      setImagePreview(null);
      
      // Send null to parent component if callback exists
      if (onImagePreview) {
        onImagePreview(null);
      }
    }
  };

  const clearForm = () => {
    setName('');
    setCategory('');
    setColor('');
    setImage(null);
    setImagePreview(null);
    
    // Reset the file input
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    
    // Clear preview in parent component
    if (onImagePreview) {
      onImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image || !name || !category || !color) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields and select an image.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await addWardrobeItem(name, category, color, image);
      
      toast({
        title: "Success!",
        description: "Item added to your wardrobe.",
      });
      
      clearForm();
      navigate('/wardrobe');
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 relative">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                ref={inputFileRef}
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {image ? image.name : "Click or drag & drop to upload"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="outerwear">Outerwear</SelectItem>
                <SelectItem value="footwear">Footwear</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Primary Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : "Add to Wardrobe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
