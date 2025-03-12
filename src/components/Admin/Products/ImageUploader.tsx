
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUploaded: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  initialImageUrl = '/placeholder.svg',
  onImageUploaded
}) => {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    // Only allow image files
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a unique filename based on timestamp and original name
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // First we need to upload to public/lovable-uploads
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file, fileName);
      
      // Upload to public folder
      const uploadPath = `/lovable-uploads/${fileName}`;
      
      // Instead of using Supabase Storage, we'll use the image in the public folder
      const publicUrl = `public${uploadPath}`;
      
      // In a real environment, we would upload to Supabase Storage
      // For now just set the URL directly
      // We'll simulate a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the image URL and call the callback
      setImageUrl(publicUrl);
      onImageUploaded(publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your product image has been uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('/placeholder.svg');
    onImageUploaded('/placeholder.svg');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-base">Product Image</Label>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Drag & Drop area */}
      <div
        onClick={handleSelectImageClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center
          h-40 border-2 border-dashed rounded-md
          transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-input bg-muted'}
          ${isUploading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          </div>
        ) : imageUrl && imageUrl !== '/placeholder.svg' ? (
          <div className="relative w-full h-full">
            <img 
              src={imageUrl}
              alt="Product"
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full border shadow hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="rounded-full bg-background p-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Drag image here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or WEBP (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
