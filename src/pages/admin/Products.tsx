
import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Image as ImageIcon,
  FileWarning
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';

// Types
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
}

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Modern Wooden Sofa',
    description: 'Elegant modern wooden sofa with comfortable cushions.',
    price: 899.99,
    discount_price: null,
    category: 'living-room',
    subcategory: 'sofas',
    image_url: '/placeholder.svg',
    stock_quantity: 15,
    is_bestseller: true,
    is_featured: true,
    is_new_arrival: false,
    is_on_sale: false
  },
  {
    id: '2',
    name: 'Elegant Dining Table',
    description: 'Beautiful dining table made from solid oak wood.',
    price: 749.99,
    discount_price: 699.99,
    category: 'dining',
    subcategory: 'tables',
    image_url: '/placeholder.svg',
    stock_quantity: 8,
    is_bestseller: false,
    is_featured: true,
    is_new_arrival: true,
    is_on_sale: true
  },
  {
    id: '3',
    name: 'Minimalist Office Chair',
    description: 'Comfortable and stylish office chair with ergonomic design.',
    price: 349.99,
    discount_price: null,
    category: 'office',
    subcategory: 'chairs',
    image_url: '/placeholder.svg',
    stock_quantity: 3,
    is_bestseller: false,
    is_featured: false,
    is_new_arrival: true,
    is_on_sale: false
  },
  {
    id: '4',
    name: 'Luxurious Bed Frame',
    description: 'King-sized bed frame with premium upholstery.',
    price: 1299.99,
    discount_price: 999.99,
    category: 'bedroom',
    subcategory: 'beds',
    image_url: '/placeholder.svg',
    stock_quantity: 5,
    is_bestseller: true,
    is_featured: true,
    is_new_arrival: false,
    is_on_sale: true
  },
  {
    id: '5',
    name: 'Outdoor Patio Set',
    description: 'Weather-resistant patio furniture set for your garden.',
    price: 1599.99,
    discount_price: null,
    category: 'outdoor',
    subcategory: 'sets',
    image_url: '/placeholder.svg',
    stock_quantity: 2,
    is_bestseller: false,
    is_featured: true,
    is_new_arrival: true,
    is_on_sale: false
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product form state
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discount_price: 0,
      category: '',
      subcategory: '',
      image_url: '/placeholder.svg',
      stock_quantity: 1,
      is_bestseller: false,
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
    },
  });
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Helper function to check for low stock
  const isLowStock = (quantity: number) => quantity <= 5;
  
  // Open edit dialog with product data
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price || 0,
      category: product.category,
      subcategory: product.subcategory || '',
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      is_bestseller: product.is_bestseller,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      is_on_sale: product.is_on_sale,
    });
    setIsAddProductOpen(true);
  };
  
  // Handle product form submission
  const onSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...p, ...data } : p
        );
        setProducts(updatedProducts);
        
        // In a real app, you would update the product in Supabase
        // await supabase
        //   .from('products')
        //   .update({
        //     name: data.name,
        //     description: data.description,
        //     price: data.price,
        //     discount_price: data.discount_price || null,
        //     category: data.category,
        //     subcategory: data.subcategory || null,
        //     image_url: data.image_url,
        //     stock_quantity: data.stock_quantity,
        //     is_bestseller: data.is_bestseller,
        //     is_featured: data.is_featured,
        //     is_new_arrival: data.is_new_arrival,
        //     is_on_sale: data.is_on_sale,
        //   })
        //   .eq('id', editingProduct.id);
          
        toast({
          title: "Product updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new product
        const newProduct = {
          id: Date.now().toString(), // In a real app, this would be a UUID
          ...data,
          discount_price: data.discount_price || null,
          subcategory: data.subcategory || null,
        };
        
        setProducts([...products, newProduct]);
        
        // In a real app, you would insert the product into Supabase
        // await supabase
        //   .from('products')
        //   .insert({
        //     name: data.name,
        //     description: data.description,
        //     price: data.price,
        //     discount_price: data.discount_price || null,
        //     category: data.category,
        //     subcategory: data.subcategory || null,
        //     image_url: data.image_url,
        //     stock_quantity: data.stock_quantity,
        //     is_bestseller: data.is_bestseller,
        //     is_featured: data.is_featured,
        //     is_new_arrival: data.is_new_arrival,
        //     is_on_sale: data.is_on_sale,
        //   });
          
        toast({
          title: "Product added",
          description: `${data.name} has been added to the catalog.`,
        });
      }
      
      // Close dialog and reset form
      setIsAddProductOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "There was an error saving the product. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Delete a product
  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;
    
    // Remove from state
    setProducts(products.filter(p => p.id !== productId));
    
    // In a real app, you would delete from Supabase
    // await supabase.from('products').delete().eq('id', productId);
    
    toast({
      title: "Product deleted",
      description: `${productToDelete.name} has been removed from the catalog.`,
    });
  };
  
  // Open add product dialog
  const handleAddProduct = () => {
    setEditingProduct(null);
    form.reset({
      name: '',
      description: '',
      price: 0,
      discount_price: 0,
      category: '',
      subcategory: '',
      image_url: '/placeholder.svg',
      stock_quantity: 1,
      is_bestseller: false,
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
    });
    setIsAddProductOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Products Management</h1>
        <p className="text-muted-foreground mt-2">Manage your product inventory.</p>
      </div>
      
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
          
          <div className="w-full sm:w-48">
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
        </div>
        
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div>{product.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="capitalize">{product.category.replace('-', ' ')}</div>
                    {product.subcategory && (
                      <div className="text-xs text-muted-foreground capitalize">{product.subcategory}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`flex items-center justify-center ${isLowStock(product.stock_quantity) ? 'text-red-500' : ''}`}>
                      {product.stock_quantity}
                      {isLowStock(product.stock_quantity) && (
                        <FileWarning className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.discount_price ? (
                      <div>
                        <span className="text-red-500 font-medium">${product.discount_price.toFixed(2)}</span>
                        <span className="text-muted-foreground text-xs line-through ml-1">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details below' : 'Fill in the product details to add it to your catalog'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                          <FormLabel>Discount Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Leave 0 for no discount
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
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the product image
                        </FormDescription>
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
                          <Input 
                            type="number" 
                            min="0" 
                            step="1" 
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
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
              
              <DialogFooter>
                <Button type="submit">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
