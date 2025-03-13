
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductList from '@/components/Admin/ProductList';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ProductTabsProps {
  onEditProduct: (product: any) => void;
  realtimeStatus?: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ onEditProduct, realtimeStatus }) => {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshProducts = () => {
    // Force re-render of ProductList to trigger a fresh data fetch
    setRefreshKey(prev => prev + 1);
    toast({ 
      title: "Refreshing Products", 
      description: "Products list is being refreshed" 
    });
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshProducts}
          className="ml-2"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Products
        </Button>
      </div>
      
      <TabsContent value="all" className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductList 
              key={`product-list-${refreshKey}`} // Force remount when refreshKey changes
              onEdit={onEditProduct}
              refreshProducts={refreshProducts}
              realtimeStatus={realtimeStatus}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="published">
        <Card>
          <CardHeader>
            <CardTitle>Published Products</CardTitle>
            <CardDescription>Products that are visible to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center text-muted-foreground">
              Published products view coming soon
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="draft">
        <Card>
          <CardHeader>
            <CardTitle>Draft Products</CardTitle>
            <CardDescription>Products that are not yet published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center text-muted-foreground">
              Draft products view coming soon
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="archived">
        <Card>
          <CardHeader>
            <CardTitle>Archived Products</CardTitle>
            <CardDescription>Products that have been archived</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center text-muted-foreground">
              Archived products view coming soon
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
