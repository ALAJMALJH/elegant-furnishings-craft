
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw,
  AlertCircle,
  Info,
  Check,
  X
} from 'lucide-react';
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Alert,
  AlertTitle,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Label,
  Input
} from '@/components/ui';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

// Define the expected structure of a product row in CSV
interface ProductCSVRow {
  name: string;
  description: string;
  price: string;
  discount_price?: string;
  category: string;
  subcategory?: string;
  image_url: string;
  stock_quantity: string;
  is_bestseller?: string;
  is_featured?: string;
  is_new_arrival?: string;
  is_on_sale?: string;
  collections?: string;
  low_stock_threshold?: string;
  [key: string]: string | undefined;
}

interface ProductCSVImportProps {
  onImportComplete: () => void;
}

export function ProductCSVImport({ onImportComplete }: ProductCSVImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [csvData, setCSVData] = useState<ProductCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<{row: number, errors: string[]}[]>([]);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [importFormat, setImportFormat] = useState<'create' | 'update'>('create');
  
  // Trigger file input click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse<ProductCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check if there are errors in parsing
        if (results.errors && results.errors.length > 0) {
          toast({
            title: 'CSV Parse Error',
            description: 'There were errors parsing the CSV file.',
            variant: 'destructive',
          });
          console.error('CSV Parse Errors:', results.errors);
          return;
        }
        
        // Validate the data
        const errors = validateCSV(results.data);
        setValidationErrors(errors);
        setCSVData(results.data);
        
        // Open preview dialog
        setIsPreviewDialogOpen(true);
      },
      error: (error) => {
        toast({
          title: 'CSV Parse Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
    
    // Reset the file input
    e.target.value = '';
  };
  
  // Validate the CSV data
  const validateCSV = (data: ProductCSVRow[]): {row: number, errors: string[]}[] => {
    const errors: {row: number, errors: string[]}[] = [];
    
    data.forEach((row, index) => {
      const rowErrors: string[] = [];
      
      // Required fields
      if (!row.name) rowErrors.push('Name is required');
      if (!row.price) rowErrors.push('Price is required');
      if (!row.category) rowErrors.push('Category is required');
      
      // Validate price format
      if (row.price && isNaN(parseFloat(row.price))) {
        rowErrors.push('Price must be a number');
      }
      
      // Validate discount price format if provided
      if (row.discount_price && isNaN(parseFloat(row.discount_price))) {
        rowErrors.push('Discount price must be a number');
      }
      
      // Validate stock quantity format if provided
      if (row.stock_quantity && isNaN(parseInt(row.stock_quantity))) {
        rowErrors.push('Stock quantity must be a number');
      }
      
      // Validate boolean fields
      ['is_bestseller', 'is_featured', 'is_new_arrival', 'is_on_sale'].forEach(field => {
        const value = row[field];
        if (value && !['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(value.toLowerCase())) {
          rowErrors.push(`${field} must be true/false, yes/no, y/n, or 1/0`);
        }
      });
      
      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors }); // +2 for header and 0-indexing
      }
    });
    
    return errors;
  };
  
  // Convert CSV boolean values to actual booleans
  const normalizeBooleanValue = (value?: string): boolean => {
    if (!value) return false;
    const lowerValue = value.toLowerCase();
    return ['true', '1', 'yes', 'y'].includes(lowerValue);
  };
  
  // Process the import
  const processImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Errors',
        description: 'Please fix the errors before importing.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsImporting(true);
    
    try {
      if (importFormat === 'create') {
        // Create new products
        const products = csvData.map(row => ({
          name: row.name,
          description: row.description || '',
          price: parseFloat(row.price),
          discount_price: row.discount_price ? parseFloat(row.discount_price) : null,
          category: row.category,
          subcategory: row.subcategory || null,
          image_url: row.image_url || '/placeholder.svg',
          stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : 0,
          is_bestseller: normalizeBooleanValue(row.is_bestseller),
          is_featured: normalizeBooleanValue(row.is_featured),
          is_new_arrival: normalizeBooleanValue(row.is_new_arrival),
          is_on_sale: normalizeBooleanValue(row.is_on_sale),
          collections: row.collections ? row.collections.split(',').map(c => c.trim()) : [],
          low_stock_threshold: row.low_stock_threshold ? parseInt(row.low_stock_threshold) : 5
        }));
        
        const { error } = await supabase
          .from('products')
          .insert(products);
          
        if (error) throw error;
        
        toast({
          title: 'Import Successful',
          description: `${products.length} products have been imported.`,
        });
      } else {
        // Update existing products based on name
        // Need to fetch existing products first
        const { data: existingProducts, error: fetchError } = await supabase
          .from('products')
          .select('id, name');
          
        if (fetchError) throw fetchError;
        
        // Create a map of product names to IDs
        const productNameToId = new Map(
          existingProducts?.map(p => [p.name.toLowerCase(), p.id]) || []
        );
        
        // Separate products to update and products to create
        const updateProducts = [];
        const createProducts = [];
        
        for (const row of csvData) {
          const productId = productNameToId.get(row.name.toLowerCase());
          
          const productData = {
            name: row.name,
            description: row.description || '',
            price: parseFloat(row.price),
            discount_price: row.discount_price ? parseFloat(row.discount_price) : null,
            category: row.category,
            subcategory: row.subcategory || null,
            image_url: row.image_url || '/placeholder.svg',
            stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : 0,
            is_bestseller: normalizeBooleanValue(row.is_bestseller),
            is_featured: normalizeBooleanValue(row.is_featured),
            is_new_arrival: normalizeBooleanValue(row.is_new_arrival),
            is_on_sale: normalizeBooleanValue(row.is_on_sale),
            collections: row.collections ? row.collections.split(',').map(c => c.trim()) : [],
            low_stock_threshold: row.low_stock_threshold ? parseInt(row.low_stock_threshold) : 5
          };
          
          if (productId) {
            updateProducts.push({ ...productData, id: productId });
          } else {
            createProducts.push(productData);
          }
        }
        
        // Update existing products
        if (updateProducts.length > 0) {
          for (const product of updateProducts) {
            const { error } = await supabase
              .from('products')
              .update(product)
              .eq('id', product.id);
              
            if (error) throw error;
          }
        }
        
        // Create new products
        if (createProducts.length > 0) {
          const { error } = await supabase
            .from('products')
            .insert(createProducts);
            
          if (error) throw error;
        }
        
        toast({
          title: 'Import Successful',
          description: `Updated ${updateProducts.length} and created ${createProducts.length} products.`,
        });
      }
      
      // Close dialog and reset state
      setIsPreviewDialogOpen(false);
      setCSVData([]);
      setValidationErrors([]);
      
      // Notify parent component that import is complete
      onImportComplete();
      
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error.message || 'An error occurred during import.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Export products to CSV
  const exportProductsCSV = async () => {
    setIsExporting(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: 'No Products',
          description: 'There are no products to export.',
        });
        return;
      }
      
      // Convert data to CSV format
      const csvData = data.map(product => ({
        name: product.name,
        description: product.description,
        price: product.price,
        discount_price: product.discount_price || '',
        category: product.category,
        subcategory: product.subcategory || '',
        image_url: product.image_url,
        stock_quantity: product.stock_quantity,
        is_bestseller: product.is_bestseller ? 'true' : 'false',
        is_featured: product.is_featured ? 'true' : 'false',
        is_new_arrival: product.is_new_arrival ? 'true' : 'false',
        is_on_sale: product.is_on_sale ? 'true' : 'false',
        collections: (product.collections || []).join(','),
        low_stock_threshold: product.low_stock_threshold || 5,
        warehouse_id: product.warehouse_id || ''
      }));
      
      // Generate CSV file
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Successful',
        description: `${data.length} products have been exported to CSV.`,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: error.message || 'An error occurred during export.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Generate template CSV
  const downloadTemplate = () => {
    const template = [
      {
        name: 'Example Product',
        description: 'This is an example product description',
        price: '499.99',
        discount_price: '399.99',
        category: 'living-room',
        subcategory: 'sofas',
        image_url: 'https://example.com/image.jpg',
        stock_quantity: '10',
        is_bestseller: 'true',
        is_featured: 'false',
        is_new_arrival: 'true',
        is_on_sale: 'true',
        collections: 'Summer Collection,New Arrivals',
        low_stock_threshold: '3'
      }
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'product_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Template Downloaded',
      description: 'CSV template has been downloaded.',
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Products</CardTitle>
          <CardDescription>Bulk import or export your product catalog</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Import Products</h4>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file to bulk import products
              </p>
              <div className="flex space-x-2">
                <Button onClick={handleImportClick} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button onClick={downloadTemplate} variant="outline">
                  <Info className="h-4 w-4 mr-2" />
                  Get Template
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Export Products</h4>
              <p className="text-sm text-muted-foreground">
                Download your product catalog as CSV
              </p>
              <Button 
                onClick={exportProductsCSV} 
                variant="outline"
                disabled={isExporting}
              >
                {isExporting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export to CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>CSV Import Preview</DialogTitle>
            <DialogDescription>
              Review the data before importing. We found {csvData.length} products.
            </DialogDescription>
          </DialogHeader>
          
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <p>Please fix the following errors in your CSV file:</p>
                <ul className="list-disc pl-5 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>
                      Row {error.row}: {error.errors.join(', ')}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Label htmlFor="import-format">Import Mode</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="create-mode" 
                      name="import-format" 
                      value="create"
                      checked={importFormat === 'create'}
                      onChange={() => setImportFormat('create')}
                    />
                    <label htmlFor="create-mode">Create New Products</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="update-mode" 
                      name="import-format" 
                      value="update"
                      checked={importFormat === 'update'}
                      onChange={() => setImportFormat('update')}
                    />
                    <label htmlFor="update-mode">Update Existing by Name</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Is Bestseller</TableHead>
                    <TableHead>Is Featured</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>AED {parseFloat(row.price).toFixed(2)}</TableCell>
                      <TableCell>{row.stock_quantity || '0'}</TableCell>
                      <TableCell>
                        {normalizeBooleanValue(row.is_bestseller) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {normalizeBooleanValue(row.is_featured) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {csvData.length > 10 && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Showing 10 of {csvData.length} products
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={processImport} 
              disabled={isImporting || validationErrors.length > 0}
            >
              {isImporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Products'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
