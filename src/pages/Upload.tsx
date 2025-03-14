
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ImageUpload from '@/components/Upload/ImageUpload';

const Upload: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Item</h1>
          <p className="text-muted-foreground mt-1">Add a new item to your wardrobe</p>
        </div>
        
        <ImageUpload />
      </div>
    </MainLayout>
  );
};

export default Upload;
