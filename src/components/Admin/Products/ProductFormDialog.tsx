
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { AlertCircle, Info, Loader2, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define product schema using zod
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  discount_price: z.coerce.number().positive({ message: "Discount price must be positive" }).nullable().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  category: z.string({ required_error: "Please select a category" }),
  subcategory: z.string().optional(),
  stock_quantity: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
  low_stock_threshold: z.coerce.number().int().nonnegative().default(5),
  shipping_weight: z.coerce.number().nonnegative().optional(),
  shipping_width: z.coerce.number().nonnegative().optional(),
  shipping_height: z.coerce.number().nonnegative().optional(),
  shipping_depth: z.coerce.number().nonnegative().optional(),
  shipping_fee: z.coerce.number().nonnegative().optional(),
  delivery_time: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  url_slug: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_on_sale: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  collections: z.array(z.string()).default([]),
  image_url: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().min(1, { message: "Image URL is required" })),
  additional_images: z.array(z.string()).default([]),
});

// Define product form types
type ProductFormValues = z.infer<typeof productSchema>;

// Sample categories
const categories = [
  "Beds", "Sofas", "Chairs", "Tables", "Dining", "Office", "Outdoor", "Storage", "Decor"
];

// Sample subcategories
const subcategories = {
  "Beds": ["King Size", "Queen Size", "Single", "Bunk Beds", "Daybeds"],
  "Sofas": ["Sectional", "Loveseats", "Sleeper", "Recliners", "Modular"],
  "Chairs": ["Accent", "Armchair", "Rocking", "Office", "Dining"],
  "Tables": ["Coffee", "End", "Console", "Nested", "Side"],
  "Dining": ["Dining Sets", "Dining Tables", "Dining Chairs", "Bar Stools", "Buffets"],
  "Office": ["Desks", "Office Chairs", "Bookcases", "Filing Cabinets", "Office Sets"],
  "Outdoor": ["Patio Sets", "Outdoor Chairs", "Outdoor Tables", "Hammocks", "Planters"],
  "Storage": ["Dressers", "Wardrobes", "Bookshelves", "Cabinets", "Sideboards"],
  "Decor": ["Rugs", "Lighting", "Wall Art", "Mirrors", "Pillows"]
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct?: any | null;
  onProductSaved?: (product: any) => void;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingProduct = null,
  onProductSaved 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [allCollections, setAllCollections] = useState<{id: string, name: string}[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  
  // Initialize form with default values or editing product
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discount_price: null,
      sku: '',
      brand: '',
      category: '',
      subcategory: '',
      stock_quantity: 1,
      low_stock_threshold: 5,
      shipping_weight: 0,
      shipping_width: 0,
      shipping_height: 0,
      shipping_depth: 0,
      shipping_fee: 0,
      delivery_time: '3-5 business days',
      meta_title: '',
      meta_description: '',
      url_slug: '',
      is_featured: false,
      is_bestseller: false,
      is_on_sale: false,
      is_new_arrival: false,
      collections: [],
      image_url: 'https://placehold.co/600x400?text=Product+Image',
      additional_images: [],
    }
  });

  // Fetch collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data, error } = await supabase
          .from('product_collections')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setAllCollections(data || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
        toast({
          title: 'Error fetching collections',
          description: 'Unable to load collections. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    fetchCollections();
  }, []);

  // Set form values if editing product
  useEffect(() => {
    if (editingProduct) {
      // Reset form with editing product values
      form.reset({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || 0,
        discount_price: editingProduct.discount_price || null,
        sku: editingProduct.sku || '',
        brand: editingProduct.brand || '',
        category: editingProduct.category || '',
        subcategory: editingProduct.subcategory || '',
        stock_quantity: editingProduct.stock_quantity || 1,
        low_stock_threshold: editingProduct.low_stock_threshold || 5,
        shipping_weight: editingProduct.shipping_weight || 0,
        shipping_width: editingProduct.shipping_width || 0,
        shipping_height: editingProduct.shipping_height || 0,
        shipping_depth: editingProduct.shipping_depth || 0,
        shipping_fee: editingProduct.shipping_fee || 0,
        delivery_time: editingProduct.delivery_time || '3-5 business days',
        meta_title: editingProduct.meta_title || '',
        meta_description: editingProduct.meta_description || '',
        url_slug: editingProduct.url_slug || '',
        is_featured: editingProduct.is_featured || false,
        is_bestseller: editingProduct.is_bestseller || false,
        is_on_sale: editingProduct.is_on_sale || false,
        is_new_arrival: editingProduct.is_new_arrival || false,
        collections: editingProduct.collections || [],
        image_url: editingProduct.image_url || 'https://placehold.co/600x400?text=Product+Image',
        additional_images: editingProduct.additional_images || [],
      });
      
      // Update selected collections
      setSelectedCollections(editingProduct.collections || []);
      
      // Update subcategories if category is selected
      if (editingProduct.category && subcategories[editingProduct.category as keyof typeof subcategories]) {
        setAvailableSubcategories(subcategories[editingProduct.category as keyof typeof subcategories]);
      }
    }
  }, [editingProduct, form]);

  // Handle category change to update subcategories
  const handleCategoryChange = (category: string) => {
    form.setValue('category', category);
    form.setValue('subcategory', ''); // Reset subcategory when category changes
    
    if (subcategories[category as keyof typeof subcategories]) {
      setAvailableSubcategories(subcategories[category as keyof typeof subcategories]);
    } else {
      setAvailableSubcategories([]);
    }
  };

  // Handle collection toggle
  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => {
      const isSelected = prev.includes(collectionId);
      
      if (isSelected) {
        form.setValue('collections', prev.filter(id => id !== collectionId));
        return prev.filter(id => id !== collectionId);
      } else {
        form.setValue('collections', [...prev, collectionId]);
        return [...prev, collectionId];
      }
    });
  };

  // Handle form submission
  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Generate URL slug if not provided
      if (!values.url_slug) {
        values.url_slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      
      // Set meta title if not provided
      if (!values.meta_title) {
        values.meta_title = values.name;
      }
      
      // Set meta description if not provided
      if (!values.meta_description) {
        values.meta_description = values.description.substring(0, 160);
      }
      
      // Update or create product in database
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: values.name,
            description: values.description,
            price: values.price,
            discount_price: values.discount_price,
            sku: values.sku,
            brand: values.brand,
            category: values.category,
            subcategory: values.subcategory,
            stock_quantity: values.stock_quantity,
            low_stock_threshold: values.low_stock_threshold,
            is_featured: values.is_featured,
            is_bestseller: values.is_bestseller,
            is_on_sale: values.is_on_sale,
            is_new_arrival: values.is_new_arrival,
            collections: selectedCollections,
            image_url: values.image_url,
            additional_images: values.additional_images,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);
          
        if (error) throw error;
        
        toast({
          title: 'Product updated',
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert({
            id: uuidv4(),
            name: values.name,
            description: values.description,
            price: values.price,
            discount_price: values.discount_price,
            sku: values.sku || `PROD-${Date.now()}`,
            brand: values.brand,
            category: values.category,
            subcategory: values.subcategory,
            stock_quantity: values.stock_quantity,
            low_stock_threshold: values.low_stock_threshold,
            is_featured: values.is_featured,
            is_bestseller: values.is_bestseller,
            is_on_sale: values.is_on_sale,
            is_new_arrival: values.is_new_arrival,
            collections: selectedCollections,
            image_url: values.image_url,
            additional_images: values.additional_images,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: 'Product created',
          description: `${values.name} has been added to the catalog.`,
        });
      }
      
      // Call onProductSaved callback if provided
      if (onProductSaved) {
        onProductSaved(values);
      }
      
      // Close the dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error saving product',
        description: 'An error occurred while saving the product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct 
              ? 'Update product information in your catalog.' 
              : 'Add a new product to your catalog. Fill in all required fields.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="seo">SEO & Visibility</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Modern Wooden King Bed" />
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
                      <FormLabel>Product Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Detailed information about materials, dimensions, features, and benefits"
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="WOOD-BED-001" />
                        </FormControl>
                        <FormDescription>
                          Unique product identifier (will be auto-generated if empty)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ajmal Furniture" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={handleCategoryChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                            disabled={availableSubcategories.length === 0}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSubcategories.map(subcategory => (
                                <SelectItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Image URL *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormDescription>
                        URL to the main product image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('image_url') && (
                  <div className="border rounded-md p-2 flex justify-center">
                    <img 
                      src={form.watch('image_url')} 
                      alt="Product preview" 
                      className="max-h-48 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Error';
                      }} 
                    />
                  </div>
                )}
              </TabsContent>
              
              {/* Pricing & Inventory Tab */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Discount Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={value === null ? '' : value}
                            onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                            min="0" 
                            step="0.01" 
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty if there's no discount
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="low_stock_threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Alert Threshold</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="1" />
                        </FormControl>
                        <FormDescription>
                          Alert when stock is below this level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Featured Product</FormLabel>
                          <FormDescription>
                            Display as featured product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_bestseller"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Bestseller</FormLabel>
                          <FormDescription>
                            Mark as bestseller product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_on_sale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>On Sale</FormLabel>
                          <FormDescription>
                            Mark as on sale product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_new_arrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>New Arrival</FormLabel>
                          <FormDescription>
                            Mark as new arrival
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Attributes Tab */}
              <TabsContent value="attributes" className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Collections</h3>
                  
                  {allCollections.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No collections found</AlertTitle>
                      <AlertDescription>
                        Create collections in the Collections section first.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {allCollections.map(collection => (
                        <Badge
                          key={collection.id}
                          variant={selectedCollections.includes(collection.id) ? 'default' : 'outline'}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => toggleCollection(collection.id)}
                        >
                          {collection.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Product Variants</h3>
                  <div className="text-sm text-muted-foreground">
                    Product variants (colors, sizes, etc.) will be supported in a future update.
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Customization Options</h3>
                  <div className="text-sm text-muted-foreground">
                    Customization options will be supported in a future update.
                  </div>
                </div>
              </TabsContent>
              
              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipping_weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shipping_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Fee</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.01" />
                        </FormControl>
                        <FormDescription>
                          Leave empty for standard shipping rates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="shipping_width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shipping_height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shipping_depth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depth (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="delivery_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time Estimate</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="3-5 business days" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* SEO & Visibility Tab */}
              <TabsContent value="seo" className="space-y-4">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Meta title for SEO (defaults to product name)" />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use product name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Meta description for SEO (defaults to first 160 chars of product description)"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use first 160 characters of product description
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="url_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="product-url-slug" />
                      </FormControl>
                      <FormDescription>
                        Custom URL for the product (auto-generated if left empty)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
