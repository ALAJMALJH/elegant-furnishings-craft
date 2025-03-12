
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types/product';

export function useProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced fetchProducts with better error handling and logging
  const fetchProducts = useCallback(async () => {
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
  }, []);

  // Set up product updates
  useEffect(() => {
    const handleProductInsert = (payload: any) => {
      setProducts(prev => [payload.new as Product, ...prev]);
      toast({ title: "New product added", duration: 3000 });
    };
    
    const handleProductUpdate = (payload: any) => {
      setProducts(prev => prev.map(p => 
        p.id === payload.new.id ? (payload.new as Product) : p
      ));
      toast({ title: "Product updated", duration: 3000 });
    };
    
    const handleProductDelete = (payload: any) => {
      setProducts(prev => prev.filter(p => p.id !== payload.old.id));
      toast({ title: "Product removed", duration: 3000 });
    };

    const processRealtimeUpdate = (payload: any) => {
      console.log('[ProductSync] Real-time update received:', payload.eventType, payload);
      
      try {
        // Update local state based on the event type
        if (payload.eventType === 'INSERT') {
          handleProductInsert(payload);
        } 
        else if (payload.eventType === 'UPDATE') {
          handleProductUpdate(payload);
        }
        else if (payload.eventType === 'DELETE') {
          handleProductDelete(payload);
        }
      } catch (err) {
        console.error('[ProductSync] Error processing real-time update:', err);
        // Fetch all products as a fallback
        fetchProducts();
      }
    };

    // Initial fetch
    fetchProducts();

    // Set up real-time subscriptions
    const channel = supabase.channel('product-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        processRealtimeUpdate
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

    // Cleanup subscription
    return () => {
      console.log('[ProductSync] Cleaning up subscription');
      supabase.removeChannel(channel).then(() => {
        console.log('[ProductSync] Channel cleanup completed');
      }).catch(err => {
        console.error('[ProductSync] Error during channel cleanup:', err);
      });
    };
  }, [fetchProducts]);

  return {
    products,
    isLoading: isLoading && !initialized,
    error,
    refreshProducts: fetchProducts
  };
}
