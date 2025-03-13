
import { useEffect, useState } from 'react';
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
  const [status, setStatus] = useState<string>('initializing');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    // Skip if no configs are provided
    if (!configs.length) return;

    const setupChannel = () => {
      const channelId = channelName || `realtime-subscription-${Date.now()}`;
      console.log(`Setting up real-time channel: ${channelId}, attempt: ${retryCount + 1}`);
      
      const channel = supabase.channel(channelId);

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
              try {
                callbacks[table](payload);
              } catch (callbackError) {
                console.error(`Error in realtime callback for ${table}:`, callbackError);
              }
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

      // Start subscription with better status handling
      channel.subscribe((status) => {
        console.log(`Realtime subscription status for ${channelId}:`, status);
        setStatus(status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates for', configs.map(c => c.table).join(', '));
          // Reset retry counter on successful subscription
          setRetryCount(0);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to real-time updates:', status);
          
          // Implement retry with exponential backoff
          if (retryCount < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
            console.log(`Retrying real-time subscription in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              
              // Remove the current channel before creating a new one
              supabase.removeChannel(channel);
            }, delay);
          } else {
            console.error(`Max retries (${maxRetries}) reached for real-time subscription`);
            if (enableToasts) {
              toast({
                title: 'Real-time updates unavailable',
                description: 'Could not establish a connection for real-time updates. Please refresh the page.',
                variant: 'destructive',
                duration: 5000,
              });
            }
          }
        }
      });

      // Return cleanup function
      return () => {
        console.log(`Removing channel: ${channelId}`);
        supabase.removeChannel(channel);
      };
    };

    // Set up the channel
    const cleanup = setupChannel();

    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, [configs, callbacks, enableToasts, channelName, retryCount]);

  return {
    status,
    retry: () => setRetryCount(prev => prev + 1)
  };
};
