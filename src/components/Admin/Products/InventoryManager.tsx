
import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, Save, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TransactionType, Warehouse } from '@/components/Admin/Discounts/types';

interface InventoryManagerProps {
  productId: string;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  onStockUpdate: (newStock: number) => void;
}

interface InventoryTransaction {
  id?: string;
  product_id: string;
  warehouse_id: string;
  quantity_change: number;
  transaction_type: TransactionType;
  notes?: string;
  created_at?: string;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  productId,
  productName,
  currentStock,
  lowStockThreshold,
  onStockUpdate,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType>('restock');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

  useEffect(() => {
    fetchWarehouses();
    fetchTransactions();
  }, [productId]);

  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Map store_locations data to match Warehouse interface
      const warehouseData: Warehouse[] = data.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address,
        city: location.address.split(',')[0] || undefined,
        state: location.address.split(',')[1]?.trim() || undefined,
        zip_code: location.address.split(',')[2]?.trim() || undefined,
        is_active: true, // Assuming all store locations are active
        created_at: location.created_at,
        updated_at: location.created_at, // Using created_at as a fallback since updated_at might not exist
      }));
      
      setWarehouses(warehouseData);
      
      if (warehouseData.length > 0 && !warehouseId) {
        setWarehouseId(warehouseData[0].id);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };
  
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!warehouseId) {
        toast({
          title: "Location required",
          description: "Please select a warehouse or store location.",
          variant: "destructive",
        });
        return;
      }
      
      if (!quantity || quantity <= 0) {
        toast({
          title: "Invalid quantity",
          description: "Please enter a positive quantity.",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate the actual change based on transaction type
      const actualChange = transactionType === 'restock' || transactionType === 'return' 
        ? quantity 
        : -quantity;
      
      // Create the transaction record
      const transactionData: InventoryTransaction = {
        product_id: productId,
        warehouse_id: warehouseId,
        quantity_change: actualChange,
        transaction_type: transactionType,
        notes: notes || undefined
      };
      
      const { error } = await supabase
        .from('inventory_transactions')
        .insert([transactionData]);
      
      if (error) throw error;
      
      // Update local state
      const newStock = currentStock + actualChange;
      onStockUpdate(newStock);
      
      // Reset form
      setQuantity(1);
      setNotes('');
      
      // Refresh transactions list
      fetchTransactions();
      
      toast({
        title: "Inventory updated",
        description: `${productName} inventory has been updated successfully.`,
      });
    } catch (error: any) {
      console.error('Error updating inventory:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error updating the inventory.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Inventory Management</CardTitle>
        <CardDescription>
          Current stock: <span className={currentStock <= lowStockThreshold ? "text-red-500 font-bold" : "font-bold"}>{currentStock}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <Select 
              value={transactionType} 
              onValueChange={(value) => setTransactionType(value as TransactionType)}
            >
              <SelectTrigger id="transaction-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restock">Restock</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity"
              type="number" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div>
            <Label htmlFor="warehouse">Location</Label>
            <Select 
              value={warehouseId} 
              onValueChange={setWarehouseId}
            >
              <SelectTrigger id="warehouse">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea 
            id="notes"
            placeholder="Enter any additional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Inventory
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
