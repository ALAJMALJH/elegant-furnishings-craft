
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from '@/components/ui/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface CartCheckerForm {
  cartId: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  id: string;
  items: CartItem[];
  total: number;
  lastUpdated: number;
}

const CartChecker: React.FC = () => {
  const [cartData, setCartData] = useState<CartState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const form = useForm<CartCheckerForm>({
    defaultValues: {
      cartId: ''
    }
  });
  
  const onSubmit = async (data: CartCheckerForm) => {
    setIsLoading(true);
    try {
      // First try with exact cart_id match
      let { data: cartRecord, error } = await supabase
        .from('carts')
        .select('cart_data')
        .eq('cart_id', data.cartId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching cart by cart_id:', error);
      }
      
      // If no results with cart_id, try to find cart where cart_data contains the cart ID
      if (!cartRecord) {
        const { data: jsonContainsResults, error: jsonError } = await supabase
          .from('carts')
          .select('cart_data')
          .contains('cart_data', { id: data.cartId })
          .maybeSingle();
          
        if (jsonError) {
          console.error('Error fetching cart by JSON contains:', jsonError);
        }
        
        if (jsonContainsResults) {
          cartRecord = jsonContainsResults;
        }
      }
      
      if (!cartRecord) {
        toast({
          title: "Cart not found",
          description: "No cart was found with the provided ID",
          variant: "destructive"
        });
        setCartData(null);
        return;
      }
      
      // Cast the JSON data to CartState
      const cart = cartRecord.cart_data as unknown as CartState;
      
      if (!cart || !cart.items) {
        toast({
          title: "Invalid cart data",
          description: "The cart data is not in the expected format",
          variant: "destructive"
        });
        setCartData(null);
        return;
      }
      
      setCartData(cart);
      
      toast({
        title: "Cart found",
        description: `Found cart with ID: ${data.cartId}`,
      });
      
      console.log("Retrieved cart data:", cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cart data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Cart Checker</CardTitle>
          <CardDescription>Enter a cart ID to view its contents</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cartId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cart ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter cart ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Check Cart'
                )}
              </Button>
            </form>
          </Form>
          
          {cartData && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Cart Contents</h3>
              {cartData.items.length === 0 ? (
                <p className="text-muted-foreground">This cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          AED {item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          AED {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 text-right">
                    <p className="text-lg font-medium">Total: AED {cartData.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(cartData.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartChecker;
