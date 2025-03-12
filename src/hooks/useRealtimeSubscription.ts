
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type SubscriptionConfig = {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  filter?: string;
  filterValues?: any[];
};

type RealtimeCallback = (payload: any) => void;

/**
 * Hook for subscribing to Supabase real-time updates
 * 
 * @param configs Array of subscription configurations
 * @param callbacks Object with callback functions for each table
 * @param enableToasts Whether to show toast notifications for updates
 * @param channelName Optional custom channel name
 */
export const useRealtimeSubscription = (
  configs: SubscriptionConfig[],
  callbacks: Record<string, RealtimeCallback>,
  enableToasts = true,
  channelName?: string
) => {
  useEffect(() => {
    // Skip if no configs are provided
    if (!configs.length) return;

    const channel = supabase.channel(channelName || 'realtime-subscription');

    // Add subscription for each config
    configs.forEach((config) => {
      const { table, event, schema = 'public', filter, filterValues } = config;
      
      // Prepare subscription options
      const subscriptionOptions: any = {
        event,
        schema,
        table,
      };
      
      // Add filter if provided
      if (filter && filterValues) {
        subscriptionOptions.filter = filter;
        subscriptionOptions.filterValues = filterValues;
      }
      
      // Subscribe to changes
      channel.on(
        'postgres_changes',
        subscriptionOptions,
        (payload) => {
          console.log(`[Realtime] ${table} ${payload.eventType}:`, payload);
          
          // Call the callback for this table if it exists
          if (callbacks[table]) {
            callbacks[table](payload);
          }
          
          // Show toast notification if enabled
          if (enableToasts) {
            const operation = payload.eventType;
            const recordName = table.replace(/_/g, ' ');
            
            const messages = {
              INSERT: `New ${recordName.slice(0, -1)} added`,
              UPDATE: `${recordName.slice(0, -1)} updated`,
              DELETE: `${recordName.slice(0, -1)} removed`,
            };
            
            toast({
              title: messages[operation as keyof typeof messages] || `${recordName} updated`,
              description: `The ${recordName} data has been updated.`,
              duration: 3000,
            });
          }
        }
      );
    });

    // Start subscription
    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error('Failed to subscribe to real-time updates:', status);
      } else {
        console.log('Successfully subscribed to real-time updates for', configs.map(c => c.table).join(', '));
      }
    });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [configs, callbacks, enableToasts, channelName]);
};
