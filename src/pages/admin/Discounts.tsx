
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Calendar, 
  Edit, 
  Trash2, 
  Search, 
  CopyCheck,
  Tag, 
  Percent
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: Date;
  endDate: Date | null;
  minPurchase: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  products: string[] | null; // null means all products
}

// Mock discount data
const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'SUMMER23',
    type: 'percentage',
    value: 20,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    minPurchase: 50,
    usageLimit: 500,
    usageCount: 342,
    isActive: true,
    products: null
  },
  {
    id: '2',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    startDate: new Date('2023-01-01'),
    endDate: null, // No end date
    minPurchase: null,
    usageLimit: null,
    usageCount: 827,
    isActive: true,
    products: null
  },
  {
    id: '3',
    code: 'FURNITURE50',
    type: 'fixed',
    value: 50,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-11-30'),
    minPurchase: 200,
    usageLimit: 200,
    usageCount: 78,
    isActive: true,
    products: ['Living Room', 'Bedroom']
  },
  {
    id: '4',
    code: 'BLACKFRIDAY',
    type: 'percentage',
    value: 30,
    startDate: new Date('2023-11-24'),
    endDate: new Date('2023-11-27'),
    minPurchase: null,
    usageLimit: 1000,
    usageCount: 0,
    isActive: false, // Not active yet
    products: null
  },
];

const mockDiscountStats = {
  active: 3,
  upcoming: 1,
  expired: 2,
  totalRedemptions: 1247,
  mostPopular: 'WELCOME10',
  revenue: 125680.45
};

const Discounts: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    type: 'percentage',
    value: 10,
    startDate: new Date(),
    isActive: true
  });
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const filteredDiscounts = discounts.filter(discount => {
    // Apply search filter
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = discount.isActive;
    } else if (filterStatus === 'inactive') {
      matchesStatus = !discount.isActive;
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const discountToAdd: Discount = {
      id,
      code: newDiscount.code || 'CODE',
      type: newDiscount.type || 'percentage',
      value: newDiscount.value || 0,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      minPurchase: newDiscount.minPurchase || null,
      usageLimit: newDiscount.usageLimit || null,
      usageCount: 0,
      isActive: newDiscount.isActive || false,
      products: null
    };
    
    setDiscounts([...discounts, discountToAdd]);
    setCreateDialogOpen(false);
    setNewDiscount({
      type: 'percentage',
      value: 10,
      startDate: new Date(),
      isActive: true
    });
    setStartDate(new Date());
    setEndDate(undefined);
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(discount => discount.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setDiscounts(discounts.map(discount => 
      discount.id === id ? { ...discount, isActive: !discount.isActive } : discount
    ));
  };

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
                      <Label htmlFor="minPurchase">Minimum Purchase ($)</Label>
                      <Input
                        id="minPurchase"
                        type="number"
                        placeholder="Optional"
                        value={newDiscount.minPurchase || ''}
                        onChange={(e) => setNewDiscount({
                          ...newDiscount, 
                          minPurchase: e.target.value ? parseFloat(e.target.value) : null
                        })}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="usageLimit">Usage Limit</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        placeholder="Optional"
                        value={newDiscount.usageLimit || ''}
                        onChange={(e) => setNewDiscount({
                          ...newDiscount, 
                          usageLimit: e.target.value ? parseInt(e.target.value) : null
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newDiscount.isActive}
                      onCheckedChange={(checked) => setNewDiscount({...newDiscount, isActive: checked})}
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
                            From: {format(discount.startDate, 'MMM d, yyyy')}
                          </div>
                          {discount.endDate && (
                            <div className="text-sm text-muted-foreground">
                              To: {format(discount.endDate, 'MMM d, yyyy')}
                            </div>
                          )}
                          {!discount.endDate && (
                            <div className="text-sm text-muted-foreground">
                              No end date
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {discount.usageCount} uses
                          </div>
                          {discount.usageLimit && (
                            <div className="text-xs text-muted-foreground">
                              Limit: {discount.usageLimit}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch
                              checked={discount.isActive}
                              onCheckedChange={() => handleToggleStatus(discount.id)}
                              className="mr-2"
                            />
                            <span className={discount.isActive ? "text-green-600" : "text-muted-foreground"}>
                              {discount.isActive ? "Active" : "Inactive"}
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
                            onClick={() => handleDeleteDiscount(discount.id)}
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
                <div className="text-2xl font-bold">{mockDiscountStats.active}</div>
                <div className="text-xs text-muted-foreground mt-1">Currently running</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Redemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDiscountStats.totalRedemptions}</div>
                <div className="text-xs text-muted-foreground mt-1">All time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue with Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockDiscountStats.revenue.toLocaleString()}</div>
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
