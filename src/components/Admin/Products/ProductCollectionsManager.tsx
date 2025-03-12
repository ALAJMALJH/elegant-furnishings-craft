
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Edit, 
  Check, 
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import { 
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  Checkbox,
} from '@/components/ui';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<ProductCollection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  // Fetch collections from database
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
        description: 'Failed to load collections. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open dialog to add/edit collection
  const openCollectionDialog = (collection?: ProductCollection) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        description: collection.description || '',
        image_url: collection.image_url || '',
      });
    } else {
      setEditingCollection(null);
      setFormData({
        name: '',
        description: '',
        image_url: '',
      });
    }
    setIsDialogOpen(true);
  };

  // Save collection to database
  const saveCollection = async () => {
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
          description: `The collection "${formData.name}" has been updated.`,
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
          description: `The collection "${formData.name}" has been created.`,
        });
      }
      
      // Close dialog and refresh collections
      setIsDialogOpen(false);
      fetchCollections();
    } catch (error: any) {
      console.error('Error saving collection:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while saving the collection.',
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Collections</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchCollections()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => openCollectionDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {collections.map(collection => (
          <Card 
            key={collection.id} 
            className={`
              cursor-pointer transition-colors
              ${selectedCollections.includes(collection.id) ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => toggleCollection(collection.id)}
          >
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-base">{collection.name}</CardTitle>
                {collection.description && (
                  <CardDescription className="text-xs line-clamp-1">
                    {collection.description}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={selectedCollections.includes(collection.id)}
                  onCheckedChange={() => toggleCollection(collection.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openCollectionDialog(collection);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {collection.image_url && (
              <CardContent className="p-2">
                <div className="h-24 bg-muted rounded-sm overflow-hidden">
                  <img 
                    src={collection.image_url} 
                    alt={collection.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {collections.length === 0 && !isLoading && (
          <div className="col-span-full bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No collections found. Create your first collection.</p>
            <Button variant="outline" className="mt-4" onClick={() => openCollectionDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Collection
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="col-span-full flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Summer Collection"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter collection description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collection-image">Image URL</Label>
              <Input
                id="collection-image"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCollection} disabled={!formData.name.trim() || isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {editingCollection ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
