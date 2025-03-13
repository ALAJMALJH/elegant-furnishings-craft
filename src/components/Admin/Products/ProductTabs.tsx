
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductList from '@/components/Admin/ProductList';
import { useToast } from '@/components/ui/use-toast';

interface ProductTabsProps {
  onEditProduct: (product: any) => void;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ onEditProduct }) => {
  const { toast } = useToast();

  const refreshProducts = () => {
    toast({ 
      title: "Refreshing Products", 
      description: "Products refreshed" 
    });
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Products</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="draft">Drafts</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductList 
              onEdit={onEditProduct}
              refreshProducts={refreshProducts}
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
