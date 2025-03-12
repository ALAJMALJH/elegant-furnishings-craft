import React, { useState, useEffect } from 'react';
import { FolderPlus, RefreshCw, Trash, Edit, Save, X, Image as ImageIcon } from 'lucide-react';
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
    setIsAddDialogOpen(true);
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
      if (editingCollection) {
        // Update existing collection
        const { error } = await supabase
          .from('product_collections')
          .update({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
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
            image_url: formData.image_url || null,
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
      toast({
        title: 'Error',
        description: error.message || 'Failed to save collection.',
        variant: 'destructive',
      });
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
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete collection.',
        variant: 'destructive',
      });
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
              <Label htmlFor="collection-image">Image URL</Label>
              <Input
                id="collection-image"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2 h-32 bg-muted rounded overflow-hidden">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
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
