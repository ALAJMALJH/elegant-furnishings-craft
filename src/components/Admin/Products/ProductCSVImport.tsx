import React, { useRef, useState } from 'react';
import { Upload, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { AlertTitle } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

interface ProductCSVImportProps {
  onImportComplete: () => void;
}

export function ProductCSVImport({ onImportComplete }: ProductCSVImportProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStats(null);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          
          if (errors.length > 0) {
            console.error('CSV parsing errors:', errors);
            toast({
              title: 'CSV parsing error',
              description: 'There were errors parsing your CSV file. Please check the format.',
              variant: 'destructive',
            });
            setIsUploading(false);
            return;
          }

          console.log('Parsed CSV data:', data);
          
          // Track import stats
          let successful = 0;
          let failed = 0;
          
          // Process each row
          for (const row of data) {
            try {
              // Transform CSV data to match product schema
              const product = {
                name: row.name || 'Unnamed Product',
                description: row.description || '',
                price: parseFloat(row.price) || 0,
                discount_price: row.discount_price ? parseFloat(row.discount_price) : null,
                category: row.category || 'uncategorized',
                subcategory: row.subcategory || null,
                image_url: row.image_url || '/placeholder.svg',
                stock_quantity: parseInt(row.stock_quantity) || 0,
                is_bestseller: row.is_bestseller === 'true',
                is_featured: row.is_featured === 'true',
                is_new_arrival: row.is_new_arrival === 'true',
                is_on_sale: row.is_on_sale === 'true',
                low_stock_threshold: parseInt(row.low_stock_threshold) || 5,
              };
              
              // Insert into Supabase
              const { error } = await supabase
                .from('products')
                .insert([product]);
                
              if (error) throw error;
              successful++;
            } catch (error) {
              console.error('Error importing product:', row, error);
              failed++;
            }
          }
          
          // Update stats and notify user
          setUploadStats({
            total: data.length,
            successful,
            failed
          });
          
          if (successful > 0) {
            toast({
              title: 'Import completed',
              description: `Successfully imported ${successful} products. Failed: ${failed}`,
              variant: failed > 0 ? 'default' : 'default',
            });
            
            // Refresh product list
            onImportComplete();
          } else if (failed > 0) {
            toast({
              title: 'Import failed',
              description: `Failed to import any products. Please check the format.`,
              variant: 'destructive',
            });
          }
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast({
            title: 'CSV parsing error',
            description: error.message,
            variant: 'destructive',
          });
        }
      });
    } catch (error: any) {
      console.error('Error processing CSV:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while processing the CSV file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplateCSV = () => {
    const template = [
      {
        name: 'Example Product',
        description: 'This is an example product description',
        price: 199.99,
        discount_price: 149.99,
        category: 'living-room',
        subcategory: 'sofas',
        image_url: 'https://example.com/image.jpg',
        stock_quantity: 10,
        is_bestseller: 'false',
        is_featured: 'true',
        is_new_arrival: 'true',
        is_on_sale: 'true',
        low_stock_threshold: 5
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
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Product CSV Import
        </CardTitle>
        <CardDescription>
          Bulk import products by uploading a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
            className="max-w-md"
          />
          <Button variant="outline" onClick={downloadTemplateCSV}>
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>
        </div>
        
        {isUploading && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span>Uploading and processing CSV...</span>
          </div>
        )}
        
        {uploadStats && (
          <Alert variant={uploadStats.failed > 0 ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Import Results</AlertTitle>
            <AlertDescription>
              Total products: {uploadStats.total}<br />
              Successfully imported: {uploadStats.successful}<br />
              Failed: {uploadStats.failed}
            </AlertDescription>
          </Alert>
        )}
        
        <Alert>
          <AlertTitle>CSV Format</AlertTitle>
          <AlertDescription className="text-sm">
            Your CSV should include the following columns: name, description, price, discount_price, 
            category, subcategory, image_url, stock_quantity, is_bestseller, is_featured, 
            is_new_arrival, is_on_sale, low_stock_threshold.
            <br /><br />
            Boolean fields (is_bestseller, is_featured, etc.) should be 'true' or 'false'.
            <br />
            Download the template for a correctly formatted example.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
