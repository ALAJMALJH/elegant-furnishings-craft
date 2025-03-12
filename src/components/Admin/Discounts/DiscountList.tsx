
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Percent, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { DiscountCode } from './types';

interface DiscountListProps {
  discounts: DiscountCode[];
  searchTerm: string;
  filterStatus: string;
}

const DiscountList: React.FC<DiscountListProps> = ({ discounts, searchTerm, filterStatus }) => {
  const queryClient = useQueryClient();

  const deleteDiscount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast({
        title: 'Discount deleted',
        description: 'The discount code has been deleted successfully.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting discount',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast({
        title: 'Status updated',
        description: 'The discount status has been updated successfully.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Filter discounts based on search and status
  const filteredDiscounts = discounts?.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : 
      filterStatus === 'active' ? discount.is_active : !discount.is_active;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle>Discount Codes</CardTitle>
        <CardDescription>
          Manage your discount codes and promotions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">{discount.code}</TableCell>
                  <TableCell>
                    {discount.type === 'percentage' 
                      ? <Badge variant="outline" className="bg-blue-50"><Percent className="h-3 w-3 mr-1" /> Percentage</Badge>
                      : <Badge variant="outline" className="bg-green-50"><Tag className="h-3 w-3 mr-1" /> Fixed</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    {discount.type === 'percentage' 
                      ? `${discount.value}%` 
                      : `$${discount.value.toFixed(2)}`
                    }
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      From: {format(new Date(discount.start_date), 'MMM d, yyyy')}
                    </div>
                    {discount.end_date && (
                      <div className="text-sm text-muted-foreground">
                        To: {format(new Date(discount.end_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    {!discount.end_date && (
                      <div className="text-sm text-muted-foreground">
                        No end date
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {discount.usage_count} uses
                    </div>
                    {discount.usage_limit && (
                      <div className="text-xs text-muted-foreground">
                        Limit: {discount.usage_limit}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Switch
                        checked={discount.is_active}
                        onCheckedChange={() => toggleStatus.mutate({ id: discount.id, isActive: !discount.is_active })}
                        className="mr-2"
                      />
                      <span className={discount.is_active ? "text-green-600" : "text-muted-foreground"}>
                        {discount.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteDiscount.mutate(discount.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No discount codes match your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DiscountList;
