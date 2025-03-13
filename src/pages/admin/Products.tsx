
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ProductsToolbar from '@/components/Admin/Products/ProductsToolbar';
import ProductTabs from '@/components/Admin/Products/ProductTabs';
import ProductFormDialog from '@/components/Admin/Products/ProductFormDialog';
import { ensureAuthForProducts, refreshAdminSession } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState<string>('initializing');

  // Initialize authentication on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsInitializing(true);
        const isAuthenticated = await ensureAuthForProducts();
        
        if (!isAuthenticated) {
          setAuthError('Authentication failed. Please refresh the page or log in again.');
          
          // Attempt one refresh
          const refreshed = await refreshAdminSession();
          if (refreshed) {
            setAuthError(null);
          }
        } else {
          setAuthError(null);
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setAuthError('Failed to initialize authentication.');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initAuth();
  }, []);

  // Check Supabase realtime connection status
  useEffect(() => {
    const checkRealtimeConnection = () => {
      try {
        // Set up a connectivity monitor for Supabase realtime
        const channel = supabase.channel('system');
        
        channel.on('system', { event: 'reconnect' }, () => {
          console.log('Realtime system reconnect event');
          setRealtimeStatus('reconnecting');
          toast({
            title: 'Reconnecting',
            description: 'Attempting to reestablish connection to real-time updates',
          });
        });
        
        channel.on('system', { event: 'disconnect' }, () => {
          console.log('Realtime system disconnect event');
          setRealtimeStatus('disconnected');
          toast({
            title: 'Disconnected',
            description: 'Real-time connection lost',
            variant: 'destructive',
          });
        });
        
        channel.subscribe((status) => {
          console.log('System channel status:', status);
          setRealtimeStatus(status);
          
          if (status === 'SUBSCRIBED') {
            toast({
              title: 'Connected',
              description: 'Successfully connected to real-time updates',
            });
          }
        });
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up realtime status monitor:', error);
        setRealtimeStatus('error');
      }
    };
    
    if (!isInitializing && !authError) {
      checkRealtimeConnection();
    }
  }, [isInitializing, authError]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductSaved = () => {
    toast({
      title: 'Product saved',
      description: 'Product saved successfully',
    });
    // ProductList will automatically update via real-time subscription
  };

  const handleRefreshAuth = async () => {
    try {
      const refreshed = await refreshAdminSession();
      if (refreshed) {
        setAuthError(null);
        toast({
          title: 'Authentication refreshed',
          description: 'Session refreshed successfully',
        });
      } else {
        toast({
          title: 'Authentication failed',
          description: 'Could not refresh authentication. Please try again or reload the page.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      toast({
        title: 'Authentication error',
        description: 'An error occurred while refreshing authentication.',
        variant: 'destructive',
      });
    }
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing product management...</p>
        </div>
      </div>
    );
  }

  const showRealtimeError = realtimeStatus === 'disconnected' || 
                            realtimeStatus === 'error' || 
                            realtimeStatus === 'CHANNEL_ERROR' ||
                            realtimeStatus === 'CLOSED';

  return (
    <>
      <Helmet>
        <title>Products Management | Admin Panel</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{authError}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshAuth}
                className="ml-4"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Session
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {showRealtimeError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Real-time Connection Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Could not establish a connection for real-time updates. Products may not update automatically.</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="ml-4"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <ProductsToolbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateProduct={handleCreateProduct}
        />
        
        <ProductTabs 
          onEditProduct={handleEditProduct} 
          realtimeStatus={realtimeStatus}
        />
      </div>
      
      {/* Product Form Dialog */}
      <ProductFormDialog 
        open={showProductForm}
        onOpenChange={setShowProductForm}
        editingProduct={editingProduct}
        onProductSaved={handleProductSaved}
      />
    </>
  );
};

export default ProductsPage;
