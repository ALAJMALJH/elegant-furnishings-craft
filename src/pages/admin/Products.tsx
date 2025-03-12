import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Edit, Trash, AlertTriangle, Package, X } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  subcategory: string | null;
  image_url: string;
  additional_images: string[] | null;
  stock_quantity: number;
  is_bestseller: boolean | null;
  is_featured: boolean | null;
  is_new_arrival: boolean | null;
  is_on_sale: boolean | null;
}

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  discount_price: z.coerce.number().positive().nullable().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().nullable().optional(),
  image_url: z.string().url({ message: "A valid image URL is required" }),
  stock_quantity: z.coerce.number().nonnegative({ message: "Stock quantity must be 0 or a positive number" }),
  is_bestseller: z.boolean().nullable().optional(),
  is_featured: z.boolean().nullable().optional(),
  is_new_arrival: z.boolean().nullable().optional(),
  is_on_sale: z.boolean().nullable().optional(),
});

const categories = [
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Outdoor",
  "Decor",
  "Lighting",
  "Kitchen",
  "Bathroom"
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discount_price: null,
      category: '',
      subcategory: null,
      image_url: '',
      stock_quantity: 0,
      is_bestseller: false,
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
    },
  });
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    let filtered = [...products];
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    if (showLowStock) {
      filtered = filtered.filter(product => product.stock_quantity < 5);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, categoryFilter, searchQuery, showLowStock]);
  
  const handleCreateProduct = (data: z.infer<typeof productSchema>) => {
    const createProduct = async () => {
      try {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            image_url: data.image_url,
            discount_price: data.discount_price || null,
            subcategory: data.subcategory || null,
            stock_quantity: data.stock_quantity,
            is_bestseller: data.is_bestseller || false,
            is_featured: data.is_featured || false,
            is_new_arrival: data.is_new_arrival || false,
            is_on_sale: data.is_on_sale || false,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setProducts([...products, newProduct]);
        form.reset();
        
        toast({
          title: 'Product Created',
          description: 'The product has been successfully created.',
        });
      } catch (error) {
        console.error('Error creating product:', error);
        toast({
          title: 'Error',
          description: 'Failed to create product. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    createProduct();
  };
  
  const handleUpdateProduct = (data: z.infer<typeof productSchema>) => {
    if (!currentProduct) return;
    
    const updateProduct = async () => {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            image_url: data.image_url,
            discount_price: data.discount_price || null,
            subcategory: data.subcategory || null,
            stock_quantity: data.stock_quantity,
            is_bestseller: data.is_bestseller || false,
            is_featured: data.is_featured || false,
            is_new_arrival: data.is_new_arrival || false,
            is_on_sale: data.is_on_sale || false,
          })
          .eq('id', currentProduct.id);
          
        if (error) throw error;
        
        setProducts(products.map(product => 
          product.id === currentProduct.id ? { ...product, ...data } : product
        ));
        
        setIsEditMode(false);
        setCurrentProduct(null);
        form.reset();
        
        toast({
          title: 'Product Updated',
          description: 'The product has been successfully updated.',
        });
      } catch (error) {
        console.error('Error updating product:', error);
        toast({
          title: 'Error',
          description: 'Failed to update product. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    updateProduct();
  };
  
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);
        
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== productToDelete.id));
      
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      
      toast({
        title: 'Product Deleted',
        description: 'The product has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditMode(true);
    
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      category: product.category,
      subcategory: product.subcategory,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      is_bestseller: product.is_bestseller || false,
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || false,
      is_on_sale: product.is_on_sale || false,
    });
  };
  
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };
  
  const cancelEdit = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    form.reset();
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Products Management</h1>
      <p className="text-muted-foreground mt-2">Add, edit and manage your product inventory.</p>
      
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="low-stock" 
              checked={showLowStock} 
              onCheckedChange={(checked) => setShowLowStock(checked as boolean)}
            />
            <label htmlFor="low-stock" className="text-sm font-medium cursor-pointer select-none">
              Show Low Stock Only
            </label>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditMode(false);
              form.reset();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Update the product details below.' 
                  : 'Fill in the details below to add a new product to your store.'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(isEditMode ? handleUpdateProduct : handleCreateProduct)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Elegant Wooden Chair" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed product description..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (AED)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
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
                            value={field.value || ''} 
                            onChange={field.onChange}
                            placeholder="Optional"
                          />
                        </FormControl>
                        <FormDescription>Leave empty for no discount</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_bestseller"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Bestseller</FormLabel>
                          <FormDescription>Mark as a bestselling product</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>Display prominently on website</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value || false}
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>New Arrival</FormLabel>
                          <FormDescription>Mark as a newly added product</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_on_sale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>On Sale</FormLabel>
                          <FormDescription>Mark as discounted or on sale</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  {isEditMode && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                  <DialogClose asChild>
                    <Button type="submit">
                      {isEditMode ? 'Update Product' : 'Add Product'}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="font-medium">AED {product.price.toFixed(2)}</div>
                        {product.discount_price && (
                          <div className="text-xs text-muted-foreground line-through">
                            AED {product.discount_price.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${product.stock_quantity < 5 ? 'text-red-500' : ''}`}>
                          {product.stock_quantity} 
                          {product.stock_quantity < 5 && (
                            <AlertTriangle className="h-4 w-4 inline ml-1 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.is_bestseller && <Badge variant="secondary">Bestseller</Badge>}
                          {product.is_new_arrival && <Badge variant="outline">New</Badge>}
                          {product.is_on_sale && <Badge variant="destructive">Sale</Badge>}
                          {product.is_featured && <Badge>Featured</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setShowLowStock(false);
                }} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {productToDelete && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center">
                <X className="h-4 w-4 mr-2" />
                <span>You are about to delete: <strong>{productToDelete.name}</strong></span>
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
