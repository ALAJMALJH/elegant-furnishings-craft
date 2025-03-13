
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Upload, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUploader } from './ImageUploader';

interface AIProductGeneratorProps {
  onProductGenerated: (productData: any) => void;
}

const AIProductGenerator: React.FC<AIProductGeneratorProps> = ({ onProductGenerated }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerate = async () => {
    if (!imageUrl) {
      toast({
        title: "Image Required",
        description: "Please upload or provide an image URL for the product.",
        variant: "destructive",
      });
      return;
    }
    
    if (!price) {
      toast({
        title: "Price Required",
        description: "Please enter a price for the product.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-product-generator', {
        body: { imageUrl, price, category },
      });
      
      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: "Product Generated",
        description: "AI has successfully generated product details.",
      });
      
      if (data.product) {
        onProductGenerated(data.product);
      }
    } catch (error: any) {
      console.error('Error generating product:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
          AI Product Generator
        </CardTitle>
        <CardDescription>
          Upload an image and provide a price to generate product details with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="image">Product Image</Label>
          <div className="mt-2">
            <ImageUploader
              initialImageUrl={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (AED)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Auto-detect</SelectItem>
                <SelectItem value="living-room">Living Room</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !imageUrl || !price}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Product Details
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIProductGenerator;
