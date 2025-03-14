
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ImageUpload from '@/components/Upload/ImageUpload';
import { Card } from '@/components/ui/card';

const Upload: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImagePreview = (url: string | null) => {
    setPreviewUrl(url);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Item</h1>
          <p className="text-muted-foreground mt-1">Add a new item to your wardrobe</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ImageUpload onImagePreview={handleImagePreview} />
          </div>
          
          <div>
            <Card className="overflow-hidden">
              {previewUrl ? (
                <div className="aspect-square relative">
                  <img 
                    src={previewUrl} 
                    alt="Image preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-muted text-muted-foreground">
                  Image preview will appear here
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
