
import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  FileUp, 
  Clock, 
  Sparkles,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface ProductsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateProduct: () => void;
}

const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  onCreateProduct
}) => {
  const { toast } = useToast();

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
        
        <Button onClick={onCreateProduct}>
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </div>
    </>
  );
};

export default ProductsToolbar;
