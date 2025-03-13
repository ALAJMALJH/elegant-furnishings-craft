
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Package, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  FileUp, 
  Clock, 
  Sparkles,
  FileDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductList } from '@/components/Admin/ProductList';
import { useToast } from '@/components/ui/use-toast';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { toast } = useToast();

  const handleCreateProduct = () => {
    toast({
      title: "Create Product",
      description: "Product creation functionality is coming soon",
    });
  };

  const handleImportProducts = () => {
    toast({
      title: "Import Products",
      description: "Product import functionality is coming soon",
    });
  };

  const handleExportProducts = () => {
    toast({
      title: "Export Products",
      description: "Product export functionality is coming soon",
    });
  };

  const handleAIGenerate = () => {
    toast({
      title: "AI Product Generation",
      description: "AI product generation is coming soon",
    });
  };

  return (
    <>
      <Helmet>
        <title>Products Management | Admin Panel</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products Management</h1>
            <p className="text-muted-foreground">Create and manage your products</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Activity Logs", description: "Activity logs coming soon" })}>
              <Clock className="mr-2 h-4 w-4" />
              Activity Logs
            </Button>
            <Button variant="outline" size="sm" onClick={handleAIGenerate}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generate
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          
          <Button size="sm" onClick={handleImportProducts}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          
          <Button size="sm" onClick={handleExportProducts}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button onClick={handleCreateProduct}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
        
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
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                  searchQuery={searchQuery}
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
      </div>
    </>
  );
};

export default ProductsPage;
