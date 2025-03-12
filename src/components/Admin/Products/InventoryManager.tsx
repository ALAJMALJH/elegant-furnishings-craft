
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown,
  FileText,
  Building,
  CalendarIcon
} from 'lucide-react';
import { 
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Textarea,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { InventoryTransaction, Warehouse } from '@/components/Admin/Discounts/types';

interface InventoryManagerProps {
  productId: string;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  onStockUpdate: (newStock: number) => void;
}

export function InventoryManager({ 
  productId, 
  productName,
  currentStock, 
  lowStockThreshold,
  onStockUpdate 
}: InventoryManagerProps) {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    warehouse_id: '',
    quantity_change: 0,
    transaction_type: 'restock',
    notes: '',
  });
  
  // Fetch inventory transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching inventory transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      setWarehouses(data || []);
      
      // Set first warehouse as default if available
      if (data && data.length > 0 && !formData.warehouse_id) {
        setFormData(prev => ({ ...prev, warehouse_id: data[0].id }));
      }
    } catch (error: any) {
      console.error('Error fetching warehouses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load warehouses.',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    fetchTransactions();
    fetchWarehouses();
  }, [productId]);
  
  // Handle form input changes
  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };
  
  // Add new transaction
  const addTransaction = async () => {
    if (!formData.warehouse_id) {
      toast({
        title: 'Error',
        description: 'Please select a warehouse.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.quantity_change || formData.quantity_change === 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid quantity.',
        variant: 'destructive',
      });
      return;
    }
    
    // For adjustments, we need to calculate the quantity change
    // for other transaction types, quantity_change is directly from the form
    let finalQuantityChange = formData.quantity_change;
    
    // For sale and return, convert to negative or positive as needed
    if (formData.transaction_type === 'sale') {
      finalQuantityChange = -Math.abs(finalQuantityChange);
    } else if (formData.transaction_type === 'return') {
      finalQuantityChange = Math.abs(finalQuantityChange);
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .insert({
          product_id: productId,
          warehouse_id: formData.warehouse_id,
          quantity_change: finalQuantityChange,
          transaction_type: formData.transaction_type,
          notes: formData.notes || null,
          created_by: null // Will be filled automatically if user is authenticated
        });
        
      if (error) throw error;
      
      // Update UI
      fetchTransactions();
      
      // Update parent component with new stock level
      onStockUpdate(currentStock + finalQuantityChange);
      
      // Show success message
      const actionText = {
        'restock': 'added to',
        'sale': 'removed from',
        'return': 'returned to',
        'adjustment': 'adjusted in'
      };
      
      toast({
        title: 'Inventory updated',
        description: `${Math.abs(finalQuantityChange)} items ${actionText[formData.transaction_type as keyof typeof actionText]} inventory.`,
      });
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      setFormData({
        warehouse_id: warehouses[0]?.id || '',
        quantity_change: 0,
        transaction_type: 'restock',
        notes: '',
      });
    } catch (error: any) {
      console.error('Error adding inventory transaction:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update inventory.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'restock':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'sale':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'return':
        return <ArrowUp className="h-4 w-4 text-blue-500" />;
      case 'adjustment':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const formatTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const getWarehouseName = (id: string) => {
    return warehouses.find(w => w.id === id)?.name || 'Unknown';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Inventory Management</h3>
          <p className="text-sm text-muted-foreground">
            Current stock: <span className={currentStock <= lowStockThreshold ? 'text-red-500 font-bold' : ''}>{currentStock}</span>
            {currentStock <= lowStockThreshold && (
              <span className="ml-2 text-red-500 text-xs">Low stock!</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchTransactions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Update Stock
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionTypeIcon(transaction.transaction_type)}
                        {formatTransactionType(transaction.transaction_type)}
                      </div>
                    </TableCell>
                    <TableCell>{getWarehouseName(transaction.warehouse_id)}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={transaction.quantity_change < 0 ? 'text-red-500' : 'text-green-500'}>
                        {transaction.quantity_change > 0 ? '+' : ''}{transaction.quantity_change}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No transactions found for this product.</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                Add First Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Input value={productName} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => handleInputChange('transaction_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse / Location</Label>
              <Select
                value={formData.warehouse_id}
                onValueChange={(value) => handleInputChange('warehouse_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity-change">Quantity</Label>
              <Input
                id="quantity-change"
                type="number"
                value={formData.quantity_change === 0 ? '' : formData.quantity_change}
                onChange={(e) => handleInputChange('quantity_change', parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
              />
              <p className="text-xs text-muted-foreground">
                {formData.transaction_type === 'restock' && 'Enter the quantity being added to inventory.'}
                {formData.transaction_type === 'sale' && 'Enter the quantity being sold (will be deducted from inventory).'}
                {formData.transaction_type === 'return' && 'Enter the quantity being returned (will be added to inventory).'}
                {formData.transaction_type === 'adjustment' && 'Enter the adjustment amount (positive or negative).'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter optional notes about this transaction"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTransaction} disabled={isLoading || !formData.warehouse_id || formData.quantity_change === 0}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Update Inventory'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
