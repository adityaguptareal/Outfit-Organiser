
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
          
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-3">Preview</h2>
            <Card className="overflow-hidden flex-1">
              {previewUrl ? (
                <div className="aspect-square relative flex items-center justify-center bg-muted">
                  <img 
                    src={previewUrl} 
                    alt="Image preview" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-muted text-muted-foreground">
                  Image preview will appear here
                </div>
              )}
            </Card>
            <p className="text-sm text-muted-foreground mt-2">
              This is how your item will appear in your wardrobe.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
