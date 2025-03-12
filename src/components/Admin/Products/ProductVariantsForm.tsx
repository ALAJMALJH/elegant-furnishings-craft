import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { ProductVariant } from '@/components/Admin/Discounts/types';

interface ProductVariantFormProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export function ProductVariantsForm({ variants, onVariantsChange }: ProductVariantFormProps) {
  const [attributeTypes, setAttributeTypes] = useState<string[]>(
    Array.from(new Set(variants.flatMap(v => Object.keys(v.attributes))))
  );
  
  const addAttributeType = () => {
    setAttributeTypes([...attributeTypes, '']);
  };

  const updateAttributeType = (index: number, value: string) => {
    const newTypes = [...attributeTypes];
    newTypes[index] = value;
    setAttributeTypes(newTypes);
  };

  const removeAttributeType = (index: number) => {
    setAttributeTypes(attributeTypes.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      name: 'New Variant',
      attributes: attributeTypes.reduce((obj, type) => {
        obj[type] = '';
        return obj;
      }, {} as Record<string, string>),
      price: 0,
      discount_price: null,
      sku: '',
      stock_quantity: 0,
    };
    
    onVariantsChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    if (field.startsWith('attr_')) {
      const attrName = field.replace('attr_', '');
      newVariants[index].attributes[attrName] = value;
    } else {
      (newVariants[index] as any)[field] = value;
    }
    onVariantsChange(newVariants);
  };

  const removeVariant = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Product Attributes</h3>
          <Button variant="outline" size="sm" onClick={addAttributeType}>
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attributeTypes.map((type, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={type}
                onChange={(e) => updateAttributeType(index, e.target.value)}
                placeholder="e.g. Color, Size"
                className="flex-1"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeAttributeType(index)}
                disabled={attributeTypes.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Product Variants</h3>
          <Button onClick={addVariant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {variants.map((variant, variantIndex) => (
            <Card key={variant.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Variant {variantIndex + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(variantIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`variant-name-${variantIndex}`}>Variant Name</Label>
                    <Input
                      id={`variant-name-${variantIndex}`}
                      value={variant.name}
                      onChange={(e) => updateVariant(variantIndex, 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`variant-sku-${variantIndex}`}>SKU</Label>
                    <Input
                      id={`variant-sku-${variantIndex}`}
                      value={variant.sku}
                      onChange={(e) => updateVariant(variantIndex, 'sku', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`variant-price-${variantIndex}`}>Price</Label>
                    <Input
                      id={`variant-price-${variantIndex}`}
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(variantIndex, 'price', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`variant-discount-price-${variantIndex}`}>Discount Price</Label>
                    <Input
                      id={`variant-discount-price-${variantIndex}`}
                      type="number"
                      value={variant.discount_price || ''}
                      placeholder="No discount"
                      onChange={(e) => updateVariant(
                        variantIndex, 
                        'discount_price', 
                        e.target.value ? parseFloat(e.target.value) : null
                      )}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`variant-stock-${variantIndex}`}>Stock Quantity</Label>
                    <Input
                      id={`variant-stock-${variantIndex}`}
                      type="number"
                      value={variant.stock_quantity}
                      onChange={(e) => updateVariant(variantIndex, 'stock_quantity', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`variant-image-${variantIndex}`}>Image URL</Label>
                    <Input
                      id={`variant-image-${variantIndex}`}
                      value={variant.image_url || ''}
                      onChange={(e) => updateVariant(variantIndex, 'image_url', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  {attributeTypes.map((attrType, attrIndex) => (
                    <div key={`${variant.id}-${attrIndex}`}>
                      <Label htmlFor={`variant-${variantIndex}-attr-${attrIndex}`}>{attrType}</Label>
                      <Input
                        id={`variant-${variantIndex}-attr-${attrIndex}`}
                        value={variant.attributes[attrType] || ''}
                        onChange={(e) => updateVariant(variantIndex, `attr_${attrType}`, e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
