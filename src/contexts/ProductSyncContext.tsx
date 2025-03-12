
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  category: string;
  subcategory: string | null;
  image_url: string;
  description: string;
  stock_quantity: number;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  collections?: string[];
}

export interface ProductCollection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface ProductSyncContextType {
  products: Product[];
  bestsellerProducts: Product[];
  featuredProducts: Product[];
  newArrivals: Product[];
  onSaleProducts: Product[];
  categories: Map<string, { count: number; image?: string }>;
  collections: ProductCollection[];
  isLoading: boolean;
  error: Error | null;
  refreshProducts: () => Promise<void>;
  refreshCollections: () => Promise<void>;
}

// Create context
const ProductSyncContext = createContext<ProductSyncContextType | undefined>(undefined);

// Custom hook for using the context
export const useProductSync = () => {
  const context = useContext(ProductSyncContext);
  if (context === undefined) {
    throw new Error('useProductSync must be used within a ProductSyncProvider');
  }
  return context;
};

// Provider component
export const ProductSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      console.log('[ProductSyncContext] Fetching products...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }

      console.log('[ProductSyncContext] Products fetched:', data?.length || 0);
      setProducts(data || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('[ProductSyncContext] Error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      toast({
        title: "Error loading products",
        description: "Unable to load products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch collections from Supabase
  const fetchCollections = async () => {
    try {
      console.log('[ProductSyncContext] Fetching collections...');
      
      const { data, error } = await supabase
        .from('product_collections')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw new Error(`Error fetching collections: ${error.message}`);
      }

      console.log('[ProductSyncContext] Collections fetched:', data?.length || 0);
      setCollections(data || []);
    } catch (err) {
      console.error('[ProductSyncContext] Error fetching collections:', err);
      toast({
        title: "Error loading collections",
        description: "Unable to load product collections. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription to products table
  useRealtimeSubscription(
    [
      { table: 'products', event: '*' },
      { table: 'product_collections', event: '*' }
    ],
    {
      products: (payload) => {
        console.log('[ProductSyncContext] Real-time product update received:', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new as Product, ...prev]);
          toast({
            title: "New product added",
            description: `${payload.new.name} has been added to the catalog.`,
            duration: 3000,
          });
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => 
            prev.map(p => p.id === payload.new.id ? (payload.new as Product) : p)
          );
          toast({
            title: "Product updated",
            description: `${payload.new.name} has been updated.`,
            duration: 3000,
          });
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => 
            prev.filter(p => p.id !== payload.old.id)
          );
          toast({
            title: "Product removed",
            description: "A product has been removed from the catalog.",
            duration: 3000,
          });
        }
      },
      product_collections: (payload) => {
        console.log('[ProductSyncContext] Real-time collection update received:', payload);
        
        // Handle different types of changes for collections
        if (payload.eventType === 'INSERT') {
          setCollections(prev => [...prev, payload.new as ProductCollection]);
          toast({
            title: "New collection added",
            description: `${payload.new.name} collection has been created.`,
            duration: 3000,
          });
        } else if (payload.eventType === 'UPDATE') {
          setCollections(prev => 
            prev.map(c => c.id === payload.new.id ? (payload.new as ProductCollection) : c)
          );
          toast({
            title: "Collection updated",
            description: `${payload.new.name} collection has been updated.`,
            duration: 3000,
          });
        } else if (payload.eventType === 'DELETE') {
          setCollections(prev => 
            prev.filter(c => c.id !== payload.old.id)
          );
          toast({
            title: "Collection removed",
            description: "A collection has been removed from the catalog.",
            duration: 3000,
          });
          
          // Also update products that might have references to this collection
          setProducts(prev => 
            prev.map(product => {
              if (product.collections?.includes(payload.old.id)) {
                return {
                  ...product,
                  collections: product.collections.filter(id => id !== payload.old.id)
                };
              }
              return product;
            })
          );
        }
      }
    },
    false, // Disable toast in useRealtimeSubscription since we're handling them manually above
    'product-sync-channel'
  );

  // Initial data load
  useEffect(() => {
    fetchProducts();
    fetchCollections();
    
    // Refresh products every 5 minutes as a fallback
    const refreshInterval = setInterval(() => {
      console.log('[ProductSyncContext] Performing scheduled refresh');
      fetchProducts();
      fetchCollections();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Filtered product lists
  const bestsellerProducts = products.filter(product => product.is_bestseller);
  const featuredProducts = products.filter(product => product.is_featured);
  const newArrivals = products.filter(product => product.is_new_arrival);
  const onSaleProducts = products.filter(product => product.is_on_sale);
  
  // Process categories
  const categories = new Map<string, { count: number; image?: string }>();
  
  products.forEach(product => {
    const category = product.category;
    const currentCategory = categories.get(category) || { count: 0 };
    categories.set(category, {
      count: currentCategory.count + 1,
      image: currentCategory.image || product.image_url // Use first product's image for the category
    });
  });

  // Create context value object
  const contextValue: ProductSyncContextType = {
    products,
    bestsellerProducts,
    featuredProducts,
    newArrivals,
    onSaleProducts,
    categories,
    collections,
    isLoading,
    error,
    refreshProducts: fetchProducts,
    refreshCollections: fetchCollections,
  };

  return (
    <ProductSyncContext.Provider value={contextValue}>
      {children}
    </ProductSyncContext.Provider>
  );
};
