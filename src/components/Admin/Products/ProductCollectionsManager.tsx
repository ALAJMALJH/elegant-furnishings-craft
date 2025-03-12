
import React, { useState, useEffect } from 'react';
import { FolderPlus, RefreshCw, Trash, Edit, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductCollection } from '@/components/Admin/Discounts/types';

interface ProductCollectionsManagerProps {
  selectedCollections: string[];
  onCollectionsChange: (collections: string[]) => void;
}

export function ProductCollectionsManager({ 
  selectedCollections, 
  onCollectionsChange 
}: ProductCollectionsManagerProps) {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<ProductCollection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Fetch collections from Supabase
  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_collections')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      setCollections(data || []);
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load collections.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchCollections();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  // Open add collection dialog
  const handleAddCollection = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      description: '',
      image_url: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsAddDialogOpen(true);
  };
  
  // Open edit collection dialog
  const handleEditCollection = (collection: ProductCollection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      image_url: collection.image_url || '',
    });
    setImageFile(null);
    setImagePreview(collection.image_url || null);
    setIsAddDialogOpen(true);
  };

  // Handle image upload to Storage bucket
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      // If editing and there was already an image_url, return that
      if (editingCollection?.image_url) {
        return editingCollection.image_url;
      }
      return null;
    }

    try {
      // Generate a unique filename with timestamp
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `collection-images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Create the bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('product-images');
        
      if (bucketError && bucketError.message.includes('not found')) {
        await supabase.storage.createBucket('product-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      }

      // Upload the file
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });

      if (error) throw error;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. ' + error.message,
        variant: 'destructive',
      });
      return null;
    }
  };
  
  // Save collection
  const saveCollection = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Collection name is required.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // First, upload the image if there is one
      const imageUrl = await uploadImage();
      
      if (editingCollection) {
        // Update existing collection
        const { error } = await supabase
          .from('product_collections')
          .update({
            name: formData.name,
            description: formData.description || null,
            image_url: imageUrl || formData.image_url || null,
          })
          .eq('id', editingCollection.id);
          
        if (error) throw error;
        
        toast({
          title: 'Collection updated',
          description: `${formData.name} has been updated.`,
        });
      } else {
        // Create new collection
        const { error } = await supabase
          .from('product_collections')
          .insert({
            name: formData.name,
            description: formData.description || null,
            image_url: imageUrl || null,
          });
          
        if (error) throw error;
        
        toast({
          title: 'Collection created',
          description: `${formData.name} has been created.`,
        });
      }
      
      // Refresh collections and close dialog
      fetchCollections();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving collection:', error);
      
      if (error.message?.includes('violates row-level security policy')) {
        toast({
          title: 'Permission Error',
          description: 'You do not have permission to create or modify collections. Please contact your administrator.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to save collection.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete collection
  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('product_collections')
        .delete()
        .eq('id', collectionId);
        
      if (error) throw error;
      
      // Remove from selected collections if present
      if (selectedCollections.includes(collectionId)) {
        onCollectionsChange(selectedCollections.filter(id => id !== collectionId));
      }
      
      // Refresh collections
      fetchCollections();
      
      toast({
        title: 'Collection deleted',
        description: 'The collection has been removed.',
      });
    } catch (error: any) {
      console.error('Error deleting collection:', error);
      
      if (error.message?.includes('violates row-level security policy')) {
        toast({
          title: 'Permission Error',
          description: 'You do not have permission to delete collections. Please contact your administrator.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete collection.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle collection selection
  const toggleCollection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      onCollectionsChange(selectedCollections.filter(id => id !== collectionId));
    } else {
      onCollectionsChange([...selectedCollections, collectionId]);
    }
  };

  // Handle file drop for image upload
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageChange(file);
    }
  };

  const handleImageChange = (file: File) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Collections</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCollections} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddCollection}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Add New Collection
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base">Assign to Collections</Label>
              <p className="text-sm text-muted-foreground">
                Select the collections this product belongs to
              </p>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">Loading collections...</p>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No collections found. Create a collection to get started.</p>
                  <Button variant="outline" className="mt-4" onClick={handleAddCollection}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create First Collection
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {collections.map(collection => (
                    <div key={collection.id} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id={`collection-${collection.id}`}
                          checked={selectedCollections.includes(collection.id)}
                          onCheckedChange={() => toggleCollection(collection.id)}
                        />
                        <div className="flex items-center gap-2">
                          {collection.image_url && (
                            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={collection.image_url} 
                                alt={collection.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <Label 
                              htmlFor={`collection-${collection.id}`}
                              className="text-base font-medium cursor-pointer"
                            >
                              {collection.name}
                            </Label>
                            {collection.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {collection.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditCollection(collection)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteCollection(collection.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add/Edit Collection Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Edit Collection' : 'Add New Collection'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Summer Collection"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter a description for this collection"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Collection Image</Label>
              <div 
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('collection-image-input')?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full">
                    <div className="relative mx-auto h-40 max-w-xs overflow-hidden rounded-md">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Drag and drop an image here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                )}
                <input
                  id="collection-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: Square image (1:1 ratio), max 5MB
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCollection} disabled={isLoading || !formData.name.trim()}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingCollection ? 'Update Collection' : 'Create Collection'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
