import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash, 
  MoreVertical, 
  Eye, 
  Copy, 
  AlertTriangle,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase, ensureAuthForProducts, refreshAdminSession } from '@/integrations/supabase/client';

// Define the Product type
interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  category: string;
  stock_quantity: number;
  is_featured: boolean;
  is_on_sale: boolean;
  is_bestseller: boolean;
  image_url: string;
}

interface ProductListProps {
  onEdit: (product: Product) => void;
  refreshProducts: () => void;
  realtimeStatus?: string;
  lastRefreshed?: Date;
}

const ProductList: React.FC<ProductListProps> = ({ 
  onEdit, 
  refreshProducts, 
  realtimeStatus,
  lastRefreshed
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Simplified subscribed state - directly derived from props
  const isSubscribed = realtimeStatus === 'SUBSCRIBED';

  // Enhanced fetchProducts function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      // Ensure authentication is set up before fetching products
      const isAuthenticated = await ensureAuthForProducts();
      if (!isAuthenticated) {
        setAuthError("Authentication failed. Please refresh or log in again.");
        setLoading(false);
        return;
      }
      
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // Check specifically for auth errors
        if (error.message.includes('JWT') || error.message.includes('auth') || error.message.includes('permission')) {
          console.error('Authentication error fetching products:', error);
          setAuthError('Session expired. Trying to refresh authentication...');
          
          // Try to refresh the session
          const refreshed = await refreshAdminSession();
          if (refreshed) {
            // Try fetching again after refresh
            const { data: retryData, error: retryError } = await supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false });
              
            if (retryError) {
              throw retryError;
            }
            
            setProducts(retryData || []);
            setAuthError(null);
            return;
          } else {
            setAuthError('Authentication failed. Please refresh the page or log in again.');
          }
        }
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error fetching products',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when lastRefreshed changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, lastRefreshed]);

  // Set up realtime subscription with improved reliability
  useEffect(() => {
    // Only set up realtime if we're subscribed according to parent
    if (!isSubscribed) {
      return;
    }
    
    console.log("Setting up realtime subscription for products...");
    const channel = supabase.channel('product-list-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        (payload) => {
          console.log('Product change received:', payload);
          
          const { eventType, new: newProduct, old: oldProduct } = payload;
          
          if (eventType === 'INSERT') {
            setProducts(prev => [newProduct as Product, ...prev]);
            toast({
              title: 'New product added',
              description: `${(newProduct as Product).name} has been added to the catalog.`,
            });
          } 
          else if (eventType === 'UPDATE') {
            setProducts(prev => 
              prev.map(product => 
                product.id === (newProduct as Product).id ? (newProduct as Product) : product
              )
            );
            toast({
              title: 'Product updated',
              description: `${(newProduct as Product).name} has been updated.`,
            });
          }
          else if (eventType === 'DELETE') {
            setProducts(prev => 
              prev.filter(product => product.id !== (oldProduct as Product).id)
            );
            toast({
              title: 'Product deleted',
              description: `A product has been removed from the catalog.`,
            });
          }
        })
      .subscribe();
    
    // Clean up on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSubscribed]);

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        // Ensure authentication before deleting
        const isAuthenticated = await ensureAuthForProducts();
        if (!isAuthenticated) {
          toast({
            title: 'Authentication error',
            description: 'Could not authenticate to delete product. Please refresh and try again.',
            variant: 'destructive',
          });
          return;
        }
        
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // If realtime is not working, update locally
        if (!isSubscribed) {
          setProducts(prev => prev.filter(product => product.id !== id));
        }
        
        toast({
          title: 'Product deleted',
          description: `${name} has been successfully deleted.`,
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error deleting product',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= 5) {
      return <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50">Low Stock ({quantity})</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-400 text-green-600 bg-green-50">In Stock ({quantity})</Badge>;
    }
  };

  // Function to handle manual refresh
  const handleManualRefresh = () => {
    fetchProducts();
    toast({
      title: 'Refreshing products',
      description: 'Manually refreshing product list',
    });
  };

  return (
    <div>
      {authError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            <span>{authError}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              await refreshAdminSession();
              fetchProducts();
            }}
            className="ml-2"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh Session
          </Button>
        </div>
      )}
      
      {!isSubscribed && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="text-sm">
                Using offline mode. Data is being refreshed automatically.
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
              className="ml-2"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh Now
            </Button>
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
                    <span>Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <AlertTriangle size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {product.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.discount_price ? (
                      <div>
                        <span className="text-muted-foreground line-through mr-2">${product.price.toFixed(2)}</span>
                        <span className="font-medium">${product.discount_price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStockStatus(product.stock_quantity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.is_bestseller && (
                        <Badge className="bg-blue-500">Bestseller</Badge>
                      )}
                      {product.is_on_sale && (
                        <Badge className="bg-red-500">On Sale</Badge>
                      )}
                      {product.is_featured && (
                        <Badge className="bg-purple-500">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/product/${product.id}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(product.id);
                          toast({ description: "Product ID copied to clipboard" });
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;
