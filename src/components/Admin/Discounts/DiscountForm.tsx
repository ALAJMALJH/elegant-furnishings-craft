
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DiscountCode } from './types';

const DiscountForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode>>({
    type: 'percentage',
    value: 10,
    is_active: true,
    applies_to: ['all']
  });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const createDiscount = useMutation({
    mutationFn: async (discount: Partial<DiscountCode>) => {
      // Ensure required fields are present
      if (!discount.code || !discount.type || discount.value === undefined) {
        throw new Error('Missing required fields: code, type, or value');
      }
      
      // Create a properly typed object with all required fields for insertion
      const discountToInsert = {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        min_purchase: discount.min_purchase || null,
        start_date: discount.start_date,
        end_date: discount.end_date || null,
        usage_limit: discount.usage_limit || null,
        is_active: discount.is_active !== undefined ? discount.is_active : true,
        applies_to: discount.applies_to || ['all']
      };
      
      const { data, error } = await supabase
        .from('discount_codes')
        .insert(discountToInsert)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      setCreateDialogOpen(false);
      toast({
        title: 'Discount created',
        description: 'The discount code has been created successfully.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating discount',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleCreate = () => {
    const discountToAdd = {
      ...newDiscount,
      start_date: startDate.toISOString(),
      end_date: endDate?.toISOString() || null,
    };
    
    createDiscount.mutate(discountToAdd);
  };

  return (
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Discount
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Discount</DialogTitle>
          <DialogDescription>
            Add a new discount code for your customers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Discount Code</Label>
            <Input
              id="code"
              placeholder="e.g. SUMMER23"
              value={newDiscount.code || ''}
              onChange={(e) => setNewDiscount({...newDiscount, code: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select 
                value={newDiscount.type} 
                onValueChange={(value: 'percentage' | 'fixed') => 
                  setNewDiscount({...newDiscount, type: value})
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="value">
                {newDiscount.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
              </Label>
              <Input
                id="value"
                type="number"
                value={newDiscount.value || ''}
                onChange={(e) => setNewDiscount({...newDiscount, value: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>No end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="min_purchase">Minimum Purchase ($)</Label>
              <Input
                id="min_purchase"
                type="number"
                placeholder="Optional"
                value={newDiscount.min_purchase || ''}
                onChange={(e) => setNewDiscount({
                  ...newDiscount, 
                  min_purchase: e.target.value ? parseFloat(e.target.value) : null
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="usage_limit">Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                placeholder="Optional"
                value={newDiscount.usage_limit || ''}
                onChange={(e) => setNewDiscount({
                  ...newDiscount, 
                  usage_limit: e.target.value ? parseInt(e.target.value) : null
                })}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={newDiscount.is_active}
              onCheckedChange={(checked) => setNewDiscount({...newDiscount, is_active: checked})}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create Discount</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountForm;
