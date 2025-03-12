
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define the type of data we'll store in context
interface AdminRealtimeContextType {
  realtimeEnabled: boolean;
  toggleRealtime: () => void;
  productStats: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  orderStats: {
    total: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  customerStats: {
    total: number;
    newToday: number;
  };
  refreshData: () => Promise<void>;
  lastRefreshed: Date | null;
}

// Create context with default values
const AdminRealtimeContext = createContext<AdminRealtimeContextType>({
  realtimeEnabled: true,
  toggleRealtime: () => {},
  productStats: { total: 0, lowStock: 0, outOfStock: 0 },
  orderStats: { total: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
  customerStats: { total: 0, newToday: 0 },
  refreshData: async () => {},
  lastRefreshed: null,
});

// Hook for components to access this context
export const useAdminRealtime = () => useContext(AdminRealtimeContext);

interface AdminRealtimeProviderProps {
  children: ReactNode;
}

export const AdminRealtimeProvider: React.FC<AdminRealtimeProviderProps> = ({ children }) => {
  // State
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [productStats, setProductStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [orderStats, setOrderStats] = useState({ 
    total: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 
  });
  const [customerStats, setCustomerStats] = useState({ total: 0, newToday: 0 });
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Function to fetch all data
  const refreshData = async () => {
    try {
      // Fetch product statistics
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, stock_quantity');
      
      if (productsError) throw productsError;
      
      // Calculate product stats
      const lowStockThreshold = 5;
      const total = products.length;
      const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold).length;
      const outOfStock = products.filter(p => p.stock_quantity === 0).length;
      
      setProductStats({ total, lowStock, outOfStock });
      
      // Fetch order statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status');
      
      if (ordersError) throw ordersError;
      
      // Calculate order stats
      const total_orders = orders.length;
      const processing = orders.filter(o => o.status === 'processing').length;
      const shipped = orders.filter(o => o.status === 'shipped').length;
      const delivered = orders.filter(o => o.status === 'delivered').length;
      const cancelled = orders.filter(o => o.status === 'cancelled').length;
      
      setOrderStats({ 
        total: total_orders, 
        processing, 
        shipped, 
        delivered, 
        cancelled 
      });

      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fetch customers (for a real app, this would be auth.users or a profiles table)
      // For our mock data, we'll use customer info from orders
      const { data: customers, error: customersError } = await supabase
        .from('orders')
        .select('customer_email, created_at')
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;
      
      // Get unique customers
      const uniqueCustomers = [...new Set(customers.map(c => c.customer_email))];
      
      // Count new customers today
      const newToday = customers.filter(c => {
        const createdDate = new Date(c.created_at);
        return createdDate >= today;
      }).length;
      
      setCustomerStats({
        total: uniqueCustomers.length,
        newToday
      });
      
      // Update last refreshed timestamp
      setLastRefreshed(new Date());
      
    } catch (error) {
      console.error('Error refreshing admin data:', error);
      toast({
        title: 'Data refresh failed',
        description: 'There was an error refreshing the dashboard data.',
        variant: 'destructive',
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    refreshData();
    
    // Set up a refresh interval if real-time is disabled
    let intervalId: number | undefined;
    
    if (!realtimeEnabled) {
      intervalId = window.setInterval(refreshData, 60000); // Refresh every minute if real-time is off
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [realtimeEnabled]);

  // Set up real-time subscriptions
  useRealtimeSubscription(
    realtimeEnabled 
      ? [
          { table: 'products', event: '*' },
          { table: 'orders', event: '*' },
          { table: 'order_items', event: '*' },
        ] 
      : [],
    {
      // When products change, update product stats
      products: () => refreshData(),
      // When orders change, update order stats
      orders: () => refreshData(),
      // When order items change, update product stats (for stock changes)
      order_items: () => refreshData(),
    },
    true // Enable toast notifications
  );

  // Toggle real-time updates
  const toggleRealtime = () => {
    setRealtimeEnabled(prev => !prev);
    toast({
      title: !realtimeEnabled ? 'Real-time updates enabled' : 'Real-time updates disabled',
      description: !realtimeEnabled 
        ? 'You will now receive real-time updates.' 
        : 'Manual refresh required to see new changes.',
    });
  };

  // Provide context to children
  return (
    <AdminRealtimeContext.Provider
      value={{
        realtimeEnabled,
        toggleRealtime,
        productStats,
        orderStats,
        customerStats,
        refreshData,
        lastRefreshed,
      }}
    >
      {children}
    </AdminRealtimeContext.Provider>
  );
};
