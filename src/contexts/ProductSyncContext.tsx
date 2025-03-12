
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
  const [error, setError] = useState<string | null>(null);

  // Derived states
  const featuredProducts = products.filter(p => p.is_featured);
  const bestsellerProducts = products.filter(p => p.is_bestseller);
  const newArrivals = products.filter(p => p.is_new_arrival);
  const onSaleProducts = products.filter(p => p.is_on_sale && p.discount_price);

  // Organize products by categories with better error handling
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

  // Enhanced fetchProducts with better error handling and logging
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
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
      setInitialized(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load products';
      console.error('[ProductSync] Error fetching products:', err);
      setError(errorMessage);
      toast({
        title: "Error loading products",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up enhanced real-time subscriptions with improved error handling
  useEffect(() => {
    fetchProducts(); // Initial fetch

    const channel = supabase.channel('product-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async (payload) => {
          console.log('[ProductSync] Real-time update received:', payload.eventType, payload);
          
          try {
            // Update local state based on the event type
            if (payload.eventType === 'INSERT') {
              setProducts(prev => [payload.new as Product, ...prev]);
              toast({ title: "New product added", duration: 3000 });
            } 
            else if (payload.eventType === 'UPDATE') {
              setProducts(prev => prev.map(p => 
                p.id === payload.new.id ? (payload.new as Product) : p
              ));
              toast({ title: "Product updated", duration: 3000 });
            }
            else if (payload.eventType === 'DELETE') {
              setProducts(prev => prev.filter(p => p.id !== payload.old.id));
              toast({ title: "Product removed", duration: 3000 });
            }
          } catch (err) {
            console.error('[ProductSync] Error processing real-time update:', err);
            // Fetch all products as a fallback
            await fetchProducts();
          }
        }
      )
      .subscribe((status) => {
        console.log('[ProductSync] Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('[ProductSync] Successfully subscribed to real-time updates');
          toast({
            title: "Real-time sync enabled",
            description: "Product updates will appear automatically.",
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[ProductSync] Failed to subscribe to real-time updates');
          toast({
            title: "Sync Error",
            description: "Unable to receive real-time updates. Please refresh.",
            variant: "destructive",
          });
        }
      });

    // Enhanced cleanup
    return () => {
      console.log('[ProductSync] Cleaning up subscription');
      supabase.removeChannel(channel).then(() => {
        console.log('[ProductSync] Channel cleanup completed');
      }).catch(err => {
        console.error('[ProductSync] Error during channel cleanup:', err);
      });
    };
  }, []);

  // Helper functions
  const getProductById = (id: string) => products.find(p => p.id === id);
  const getProductsByCategory = (category: string) => products.filter(p => p.category === category);

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
