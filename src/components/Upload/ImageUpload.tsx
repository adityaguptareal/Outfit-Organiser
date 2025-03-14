
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image, X, FileUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addWardrobeItem } from '@/services/wardrobeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ImageUploadProps {
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (fileData: File) => {
    // Check if file is an image
    if (!fileData.type.startsWith('image/')) {
      toast.error('File is not an image');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setUploadedImage(e.target.result);
        setFile(fileData);
      }
    };
    reader.readAsDataURL(fileData);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setFile(null);
    setIsSuccess(false);
  };

  const handleSaveToWardrobe = async () => {
    if (!file || !itemName || !category || !color) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to save items');
      return;
    }

    try {
      setIsLoading(true);
      await addWardrobeItem(itemName, category, color, file);
      setIsLoading(false);
      setIsSuccess(true);
      
      toast.success('Item added to your wardrobe!');
      
      // Reset the form after success
      setTimeout(() => {
        setUploadedImage(null);
        setFile(null);
        setItemName('');
        setCategory('');
        setColor('');
        setIsSuccess(false);
        
        // Navigate to wardrobe
        navigate('/wardrobe');
      }, 2000);
    } catch (error) {
      console.error('Error saving item:', error);
      setIsLoading(false);
      toast.error('Failed to add item to wardrobe');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <GlassmorphicContainer className="p-6">
        <h3 className="text-xl font-semibold tracking-tight mb-4">Upload Clothing Item</h3>
        
        <div 
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30",
            uploadedImage ? "aspect-auto" : "aspect-video"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!uploadedImage ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Upload size={24} className="text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">Drag & Drop your image</h4>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload your clothing item image for AI categorization. 
                Supported formats: JPG, PNG, WEBP.
              </p>
              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                <FileUp size={16} className="mr-2" />
                Select File
              </Button>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileInput} 
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded clothing"
                className="max-h-[400px] mx-auto rounded-md"
              />
              
              <button 
                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground"
                onClick={handleRemoveImage}
              >
                <X size={16} />
              </button>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium">Processing image...</p>
                  </div>
                </div>
              )}
              
              {isSuccess && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <CheckCircle2 size={16} className="text-green-500 mr-2" />
                  <span className="text-sm font-medium">Image uploaded successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Image details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-xs text-muted-foreground block mb-1">
                Item Name
              </Label>
              <Input 
                type="text" 
                id="name" 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. White Oxford Shirt"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-xs text-muted-foreground block mb-1">
                Category
              </Label>
              <select 
                id="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select category</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="outerwear">Outerwear</option>
                <option value="footwear">Footwear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="color" className="text-xs text-muted-foreground block mb-1">
              Color
            </Label>
            <Input 
              type="text" 
              id="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. White, Black, Navy, etc."
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              disabled={!uploadedImage || !itemName || !category || !color || isLoading}
              onClick={handleSaveToWardrobe}
            >
              {isLoading ? 'Saving...' : 'Save to Wardrobe'}
            </Button>
          </div>
        </div>
      </GlassmorphicContainer>
    </div>
  );
};

export default ImageUpload;
