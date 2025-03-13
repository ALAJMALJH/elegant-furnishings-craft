
import React, { useState, useEffect } from 'react';
import { Plus, Trash, RefreshCw, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase, refreshAdminSession, ensureAuthForCollections } from '@/integrations/supabase/client';
import { ImageUploader } from './ImageUploader';

interface ProductCollection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface ProductCollectionsManagerProps {
  selectedCollections: string[];
  onCollectionsChange: (collections: string[]) => void;
}

export const ProductCollectionsManager: React.FC<ProductCollectionsManagerProps> = ({
  selectedCollections,
  onCollectionsChange,
}) => {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionImage, setNewCollectionImage] = useState('');
  const [editingCollection, setEditingCollection] = useState<ProductCollection | null>(null);

  useEffect(() => {
    // Listen for real-time collection updates
    const handleCollectionUpdate = () => {
      console.log("Collection updated event received, refreshing...");
      fetchCollections();
    };
    
    window.addEventListener('collection_updated', handleCollectionUpdate);
    
    // Fetch collections on component mount
    fetchCollections();
    
    return () => {
      window.removeEventListener('collection_updated', handleCollectionUpdate);
    };
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      
      // Refresh session if needed
      await refreshAdminSession();
      
      const { data, error } = await supabase
        .from('product_collections')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }

      setCollections(data || []);
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to load collections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Ensure user is authenticated
      const isAuthenticated = await ensureAuthForCollections();
      if (!isAuthenticated) {
        throw new Error('Authentication required to create collections. Please log in again.');
      }
      
      const newCollection = {
        name: newCollectionName,
        description: newCollectionDescription || null,
        image_url: newCollectionImage || null,
      };

      console.log("Adding collection:", newCollection);
      
      const { data, error } = await supabase
        .from('product_collections')
        .insert([newCollection])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Collection created successfully",
      });

      setCollections([...collections, data]);
      resetForm();
    } catch (err: any) {
      console.error('Error adding collection:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollection = async () => {
    if (!editingCollection) return;
    
    try {
      setIsLoading(true);
      
      // Ensure user is authenticated
      const isAuthenticated = await ensureAuthForCollections();
      if (!isAuthenticated) {
        throw new Error('Authentication required to update collections. Please log in again.');
      }
      
      const updatedCollection = {
        name: editingCollection.name,
        description: editingCollection.description,
        image_url: editingCollection.image_url,
      };

      console.log("Updating collection:", updatedCollection);
      
      const { error } = await supabase
        .from('product_collections')
        .update(updatedCollection)
        .eq('id', editingCollection.id);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Collection updated successfully",
      });

      setCollections(collections.map(c => 
        c.id === editingCollection.id ? editingCollection : c
      ));
      setEditingCollection(null);
    } catch (err: any) {
      console.error('Error updating collection:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    
    try {
      setIsLoading(true);
      
      // Ensure user is authenticated
      const isAuthenticated = await ensureAuthForCollections();
      if (!isAuthenticated) {
        throw new Error('Authentication required to delete collections. Please log in again.');
      }
      
      const { error } = await supabase
        .from('product_collections')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });

      // Remove collection from selected collections
      if (selectedCollections.includes(id)) {
        onCollectionsChange(selectedCollections.filter(collId => collId !== id));
      }
      
      // Remove collection from list
      setCollections(collections.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting collection:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollectionSelection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      // Remove collection
      onCollectionsChange(selectedCollections.filter(id => id !== collectionId));
    } else {
      // Add collection
      onCollectionsChange([...selectedCollections, collectionId]);
    }
  };

  const resetForm = () => {
    setNewCollectionName('');
    setNewCollectionDescription('');
    setNewCollectionImage('');
    setIsAddingCollection(false);
  };

  const startEditing = (collection: ProductCollection) => {
    setEditingCollection({...collection});
  };

  const cancelEditing = () => {
    setEditingCollection(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Collections</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCollections}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsAddingCollection(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Collection
          </Button>
        </div>
      </div>

      {isAddingCollection && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={newCollectionName} 
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newCollectionDescription} 
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="Collection description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image</label>
              <ImageUploader
                initialImageUrl={newCollectionImage}
                onImageUploaded={(url) => setNewCollectionImage(url)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button 
              onClick={addCollection}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {isLoading && !isAddingCollection && !editingCollection ? (
        <div className="flex justify-center py-4">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Card 
              key={collection.id}
              className={`border-2 ${selectedCollections.includes(collection.id) ? 'border-primary' : 'border-transparent'}`}
            >
              {editingCollection && editingCollection.id === collection.id ? (
                <>
                  <CardHeader className="pb-2">
                    <Input 
                      value={editingCollection.name} 
                      onChange={(e) => setEditingCollection({...editingCollection, name: e.target.value})}
                      className="font-semibold"
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      value={editingCollection.description || ''} 
                      onChange={(e) => setEditingCollection({...editingCollection, description: e.target.value})}
                      rows={3}
                    />
                    <ImageUploader
                      initialImageUrl={editingCollection.image_url || ''}
                      onImageUploaded={(url) => setEditingCollection({...editingCollection, image_url: url})}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={updateCollection}
                    >
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleCollectionSelection(collection.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{collection.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {collection.image_url && (
                        <div className="h-32 mb-2 rounded overflow-hidden bg-muted flex items-center justify-center">
                          <img 
                            src={collection.image_url} 
                            alt={collection.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {collection.description || 'No description available'}
                      </p>
                    </CardContent>
                  </div>
                  <CardFooter className="flex justify-between">
                    <Badge variant={selectedCollections.includes(collection.id) ? "default" : "outline"}>
                      {selectedCollections.includes(collection.id) ? "Selected" : "Click to select"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => startEditing(collection)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => deleteCollection(collection.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
          
          {collections.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No collections found. Create a collection to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
