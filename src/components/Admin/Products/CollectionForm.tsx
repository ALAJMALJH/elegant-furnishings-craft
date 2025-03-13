
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from './ImageUploader';
import { toast } from '@/components/ui/use-toast';
import { supabase, refreshAdminSession } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Collection name must be at least 2 characters' }),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  open: boolean;
  onClose: () => void;
  collection?: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  };
  onSave: () => void;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  open,
  onClose,
  collection,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (collection) {
      form.reset({
        name: collection.name,
        description: collection.description || '',
        image_url: collection.image_url || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        image_url: '',
      });
    }
  }, [collection, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // Refresh session if needed
      await refreshAdminSession();
      
      const collectionData = {
        name: values.name,
        description: values.description || null,
        image_url: values.image_url || null,
      };

      if (collection) {
        // Update existing collection
        const { error } = await supabase
          .from('product_collections')
          .update(collectionData)
          .eq('id', collection.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Collection updated successfully",
        });
      } else {
        // Create new collection
        const { error } = await supabase
          .from('product_collections')
          .insert([collectionData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Collection created successfully",
        });
      }
      
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving collection:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to save collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{collection ? 'Edit Collection' : 'Create New Collection'}</DialogTitle>
          <DialogDescription>
            {collection 
              ? 'Update the details of this collection' 
              : 'Add a new collection to organize your products'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this collection"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      initialImageUrl={field.value || ''}
                      onImageUploaded={(url) => form.setValue('image_url', url)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
