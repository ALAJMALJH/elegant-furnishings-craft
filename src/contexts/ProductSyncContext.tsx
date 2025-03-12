
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

// Define the types for products
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory: string | null;
  image_url: string;
  discount_price: number | null;
  stock_quantity: number;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  created_at: string;
  updated_at: string;
}

// Context interface
interface ProductSyncContextType {
  products: Product[];
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  newArrivals: Product[];
  onSaleProducts: Product[];
  categories: Map<string, { count: number; image: string }>;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

// Create context with default values
const ProductSyncContext = createContext<ProductSyncContextType>({
  products: [],
  featuredProducts: [],
  bestsellerProducts: [],
  newArrivals: [],
  onSaleProducts: [],
  categories: new Map(),
  isLoading: true,
  refreshProducts: async () => {},
  getProductById: () => undefined,
  getProductsByCategory: () => [],
});

// Hook for components to access this context
export const useProductSync = () => useContext(ProductSyncContext);

interface ProductSyncProviderProps {
  children: ReactNode;
}

export const ProductSyncProvider: React.FC<ProductSyncProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Derived states for different product categories
  const featuredProducts = products.filter(p => p.is_featured);
  const bestsellerProducts = products.filter(p => p.is_bestseller);
  const newArrivals = products.filter(p => p.is_new_arrival);
  const onSaleProducts = products.filter(p => p.is_on_sale && p.discount_price);

  // Organize products by categories
  const categories = new Map<string, { count: number; image: string }>();
  products.forEach(product => {
    if (!product.category) return;
    
    const existing = categories.get(product.category);
    if (existing) {
      categories.set(product.category, {
        count: existing.count + 1,
        image: existing.image || product.image_url,
      });
    } else {
      categories.set(product.category, {
        count: 1,
        image: product.image_url,
      });
    }
  });

  // Fetch all products with cache busting
  const fetchProducts = async () => {
    setIsLoading(true);
    console.log('[ProductSync] Fetching products...');
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('[ProductSync] Fetched products:', data?.length);
      setProducts(data || []);
    } catch (err) {
      console.error('[ProductSync] Error fetching products:', err);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  };

  // Set up real-time subscriptions with error handling
  useEffect(() => {
    fetchProducts(); // Initial fetch

    const channel = supabase.channel('product-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async (payload) => {
          console.log('[ProductSync] Real-time update received:', payload);
          
          // Always fetch fresh data after any change
          await fetchProducts();
          
          // Show toast notification
          toast({
            title: 'Products Updated',
            description: 'Product catalog has been updated.',
            duration: 3000,
          });
        }
      )
      .subscribe((status) => {
        console.log('[ProductSync] Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('[ProductSync] Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[ProductSync] Failed to subscribe to real-time updates');
          toast({
            title: 'Connection Error',
            description: 'Unable to receive real-time updates. Please refresh the page.',
            variant: 'destructive',
          });
        }
      });

    // Cleanup
    return () => {
      console.log('[ProductSync] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper functions
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };
  
  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
  };

  const value = {
    products,
    featuredProducts,
    bestsellerProducts,
    newArrivals,
    onSaleProducts,
    categories,
    isLoading: isLoading && !initialized,
    refreshProducts: fetchProducts,
    getProductById,
    getProductsByCategory,
  };

  return (
    <ProductSyncContext.Provider value={value}>
      {children}
    </ProductSyncContext.Provider>
  );
};
