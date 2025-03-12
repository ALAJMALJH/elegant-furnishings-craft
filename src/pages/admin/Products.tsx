import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Image as ImageIcon,
  FileWarning,
  RefreshCw,
  Filter,
  Layers,
  BarChart3,
  Table2,
  Warehouse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { ProductVariant, ProductCollection, Json } from '@/components/Admin/Discounts/types';
import { ProductCSVImport } from '@/components/Admin/Products/ProductCSVImport';
import { ProductVariantsForm } from '@/components/Admin/Products/ProductVariantsForm';
import { ProductCollectionsManager } from '@/components/Admin/Products/ProductCollectionsManager';
import { InventoryManager } from '@/components/Admin/Products/InventoryManager';
import { ImageUploader } from '@/components/Admin/Products/ImageUploader';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  subcategory: string | null;
  image_url: string;
  stock_quantity: number;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  variants: ProductVariant[] | null;
  collections: string[] | null;
  low_stock_threshold: number;
  warehouse_id: string | null;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  subcategory: string;
  image_url: string;
  stock_quantity: number;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  low_stock_threshold: number;
  warehouse_id: string | null;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [warehouses, setWarehouses] = useState<{id: string, name: string}[]>([]);
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discount_price: null,
      category: '',
      subcategory: '',
      image_url: '/placeholder.svg',
      stock_quantity: 1,
      is_bestseller: false,
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
      low_stock_threshold: 5,
      warehouse_id: null,
    },
  });
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      console.log('Fetched products:', data);
      
      const transformedData = data?.map(item => {
        return {
          ...item,
          variants: item.variants ? (item.variants as any[]).map(v => ({
            ...v,
            id: v.id || crypto.randomUUID(),
            attributes: v.attributes || {},
            price: v.price || 0,
            discount_price: v.discount_price || null,
            sku: v.sku || '',
            stock_quantity: v.stock_quantity || 0,
            image_url: v.image_url || undefined,
          })) : null,
          collections: item.collections || []
        } as Product;
      });
      
      setProducts(transformedData || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }

      setWarehouses(data || []);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  useRealtimeSubscription(
    [{ table: 'products', event: '*' }],
    {
      products: (payload) => {
        console.log('Product updated, refreshing:', payload);
        
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new as Product, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => 
            prev.map(p => p.id === payload.new.id ? (payload.new as Product) : p)
          );
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => 
            prev.filter(p => p.id !== payload.old.id)
          );
        }
      }
    },
    false,
    'admin-products-channel'
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
                         (stockFilter === 'low' && product.stock_quantity <= (product.low_stock_threshold || 5)) ||
                         (stockFilter === 'out' && product.stock_quantity === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const isLowStock = (product: Product) => product.stock_quantity <= (product.low_stock_threshold || 5);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setVariants(product.variants || []);
    setSelectedCollections(product.collections || []);
    
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      category: product.category,
      subcategory: product.subcategory || '',
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      is_bestseller: product.is_bestseller,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      is_on_sale: product.is_on_sale,
      low_stock_threshold: product.low_stock_threshold || 5,
      warehouse_id: product.warehouse_id,
    });
    
    setIsAddProductOpen(true);
    setActiveTab('general');
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      
      const supabaseVariants = variants.length > 0 
        ? variants.map(v => ({
            id: v.id,
            name: v.name,
            attributes: v.attributes,
            price: v.price,
            discount_price: v.discount_price,
            sku: v.sku,
            stock_quantity: v.stock_quantity,
            image_url: v.image_url
          }))
        : null;
      
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount_price: data.discount_price,
        category: data.category,
        subcategory: data.subcategory || null,
        image_url: data.image_url,
        stock_quantity: data.stock_quantity,
        is_bestseller: data.is_bestseller,
        is_featured: data.is_featured,
        is_new_arrival: data.is_new_arrival,
        is_on_sale: data.is_on_sale,
        variants: supabaseVariants,
        collections: selectedCollections.length > 0 ? selectedCollections : [],
        low_stock_threshold: data.low_stock_threshold,
        warehouse_id: data.warehouse_id,
      };
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
          
        if (error) throw error;
          
        toast({
          title: "Product updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
          
        toast({
          title: "Product added",
          description: `${data.name} has been added to the catalog.`,
        });
      }
      
      setIsAddProductOpen(false);
      setEditingProduct(null);
      resetFormState();
      
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error saving the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormState = () => {
    form.reset({
      name: '',
      description: '',
      price: 0,
      discount_price: null,
      category: '',
      subcategory: '',
      image_url: '/placeholder.svg',
      stock_quantity: 1,
      is_bestseller: false,
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
      low_stock_threshold: 5,
      warehouse_id: null,
    });
    setVariants([]);
    setSelectedCollections([]);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const productToDelete = products.find(p => p.id === productId);
      if (!productToDelete) return;
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed from the catalog.`,
      });
      
      setProducts(products.filter(p => p.id !== productId));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error deleting the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    resetFormState();
    setIsAddProductOpen(true);
    setActiveTab('general');
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, stock_quantity: newStock } : p)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Products Management</h1>
        <p className="text-muted-foreground mt-2">Manage your product inventory.</p>
      </div>
      
      <ProductCSVImport onImportComplete={fetchProducts} />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-40">
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="living-room">Living Room</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-40">
            <Select
              value={stockFilter}
              onValueChange={(value) => setStockFilter(value)}
            >
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" size="icon" title="Refresh Products">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furniture-accent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                            {product.variants && product.variants.length > 0 && (
                              <div className="text-xs text-blue-500 mt-1">
                                {product.variants.length} variants
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="capitalize">{product.category.replace('-', ' ')}</div>
                        {product.subcategory && (
                          <div className="text-xs text-muted-foreground capitalize">{product.subcategory}</div>
                        )}
                        {product.collections && product.collections.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.collections.slice(0, 2).map((collectionId, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {collectionId}
                              </Badge>
                            ))}
                            {product.collections.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.collections.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`flex items-center justify-center ${isLowStock(product) ? 'text-red-500' : ''}`}>
                          {product.stock_quantity}
                          {isLowStock(product) && (
                            <FileWarning className="ml-1 h-4 w-4" />
                          )}
                        </div>
                        {product.warehouse_id && (
                          <div className="text-xs text-muted-foreground flex items-center justify-center mt-1">
                            <Warehouse className="h-3 w-3 mr-1" />
                            {warehouses.find(w => w.id === product.warehouse_id)?.name || 'Unknown'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.discount_price ? (
                          <div>
                            <span className="text-red-500 font-medium">AED {product.discount_price.toFixed(2)}</span>
                            <span className="text-muted-foreground text-xs line-through ml-1">AED {product.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span>AED {product.price.toFixed(2)}</span>
                        )}
                        {product.variants && product.variants.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Multiple price points
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.is_bestseller && (
                            <Badge variant="secondary" className="text-xs">Bestseller</Badge>
                          )}
                          {product.is_featured && (
                            <Badge variant="secondary" className="text-xs">Featured</Badge>
                          )}
                          {product.is_new_arrival && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          {product.is_on_sale && (
                            <Badge variant="secondary" className="text-xs text-red-500">Sale</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No products found. Add some products to get started.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details below' : 'Fill in the product details to add it to your catalog'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="general" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Modern Wooden Sofa" {...field} />
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
                                placeholder="Enter product description" 
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (AED)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="0.01" 
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="discount_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Price (AED)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="0.01" 
                                  placeholder="0.00"
                                  value={field.value === null ? '' : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value === '' ? null : parseFloat(e.target.value);
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave empty for no discount
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="living-room">Living Room</SelectItem>
                                  <SelectItem value="bedroom">Bedroom</SelectItem>
                                  <SelectItem value="dining">Dining</SelectItem>
                                  <SelectItem value="office">Office</SelectItem>
                                  <SelectItem value="outdoor">Outdoor</SelectItem>
                                </SelectContent>
                              </Select>
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
                                <Input placeholder="e.g. sofas, tables" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ImageUploader
                                initialImageUrl={field.value}
                                onImageUploaded={(url) => field.onChange(url)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2 pt-2">
                        <Label className="text-base">Product Status</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="is_bestseller"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Bestseller
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Featured
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="is_new_arrival"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  New Arrival
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="is_on_sale"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  On Sale
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="variants" className="mt-4">
                  <ProductVariantsForm 
                    variants={variants} 
                    onVariantsChange={setVariants} 
                  />
                </TabsContent>
                
                <TabsContent value="collections" className="mt-4">
                  <ProductCollectionsManager
                    selectedCollections={selectedCollections}
                    onCollectionsChange={setSelectedCollections}
                  />
                </TabsContent>
                
                <TabsContent value="inventory" className="mt-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="stock_quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="1" 
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
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
                            <FormLabel>Low Stock Threshold</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="1" 
                                placeholder="5"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                              />
                            </FormControl>
                            <FormDescription>
                              Set the threshold for low stock alerts
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="warehouse_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Warehouse / Store Location</FormLabel>
                            <Select
                              value={field.value || ''}
                              onValueChange={(value) => field.onChange(value === '' ? null : value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">Not assigned</SelectItem>
                                {warehouses.map((warehouse) => (
                                  <SelectItem key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Assign this product to a physical location
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {editingProduct && (
                      <InventoryManager
                        productId={editingProduct.id}
                        productName={editingProduct.name}
                        currentStock={editingProduct.stock_quantity}
                        lowStockThreshold={editingProduct.low_stock_threshold || 5}
                        onStockUpdate={(newStock) => {
                          form.setValue('stock_quantity', newStock);
                          handleStockUpdate(editingProduct.id, newStock);
                        }}
                      />
                    )}
                  </div>
                </TabsContent>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {editingProduct ? 'Saving...' : 'Adding...'}
                      </>
                    ) : (
                      editingProduct ? 'Save Changes' : 'Add Product'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
