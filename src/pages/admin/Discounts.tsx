
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, Edit, Trash2, Search, CopyCheck, Tag, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase: number | null;
  start_date: string;
  end_date: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  applies_to: string[];
  created_at: string;
  updated_at: string;
}

// Data for analytics section
const discountStats = {
  active: 3,
  totalRedemptions: 1247,
  revenue: 125680
};

const Discounts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode>>({
    type: 'percentage',
    value: 10,
    is_active: true,
    applies_to: ['all']
  });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { data: discounts, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching discounts',
          description: error.message,
          variant: 'destructive'
        });
        throw error;
      }
      return data as DiscountCode[];
    }
  });

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

  const handleCreate = () => {
    const discountToAdd = {
      ...newDiscount,
      start_date: startDate.toISOString(),
      end_date: endDate?.toISOString() || null,
    };
    
    createDiscount.mutate(discountToAdd);
  };

  const filteredDiscounts = discounts?.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : 
      filterStatus === 'active' ? discount.is_active : !discount.is_active;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Discount Management</h1>
        <p className="text-muted-foreground mt-2">Create and manage promotional offers and discounts.</p>
      </div>
      
      <Tabs defaultValue="discounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discounts" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discount codes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Discounts</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
          </div>
          
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
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{discountStats.active}</div>
                <div className="text-xs text-muted-foreground mt-1">Currently running</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Redemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{discountStats.totalRedemptions}</div>
                <div className="text-xs text-muted-foreground mt-1">All time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue with Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${discountStats.revenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">From discounted orders</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Discounts</CardTitle>
              <CardDescription>Discount codes with the highest usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Revenue Generated</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">WELCOME10</TableCell>
                    <TableCell>827</TableCell>
                    <TableCell>$54,320.15</TableCell>
                    <TableCell>8.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SUMMER23</TableCell>
                    <TableCell>342</TableCell>
                    <TableCell>$42,765.80</TableCell>
                    <TableCell>6.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">FURNITURE50</TableCell>
                    <TableCell>78</TableCell>
                    <TableCell>$28,594.50</TableCell>
                    <TableCell>12.3%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <CopyCheck className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Discounts;
