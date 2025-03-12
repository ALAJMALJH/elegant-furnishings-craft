
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  MousePointer, 
  ShoppingBag, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  AlertCircle,
  ReceiptText,
  CheckCircle2,
  Download,
  Mail as MailIcon
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data for demonstration
const TRAFFIC_SOURCES = [
  { source: 'Google', visits: 2456, percentage: 42, change: 12 },
  { source: 'Direct', visits: 1234, percentage: 27, change: 8 },
  { source: 'Social Media', visits: 845, percentage: 15, change: -3 },
  { source: 'Email', visits: 432, percentage: 8, change: 15 },
  { source: 'Referral', visits: 321, percentage: 6, change: 4 },
  { source: 'Other', visits: 123, percentage: 2, change: -1 },
];

const TOP_PAGES = [
  { path: '/', title: 'Homepage', visits: 1243, avgTime: '2:34' },
  { path: '/category/living-room', title: 'Living Room', visits: 876, avgTime: '3:21' },
  { path: '/category/bedroom', title: 'Bedroom', visits: 654, avgTime: '2:45' },
  { path: '/bestsellers', title: 'Bestsellers', visits: 543, avgTime: '4:12' },
  { path: '/custom-furniture', title: 'Custom Furniture', visits: 432, avgTime: '5:34' },
];

const VISITOR_DATA = {
  today: { count: 326, change: 8 },
  week: { count: 2145, change: 12 },
  month: { count: 8432, change: -3 },
};

// New mock data for conversion analytics
const CONVERSION_DATA = {
  overall: { rate: 3.8, change: 0.5 },
  bySource: [
    { source: 'Google', rate: 4.2, change: 0.7 },
    { source: 'Direct', rate: 5.1, change: 1.2 },
    { source: 'Social Media', rate: 2.8, change: -0.3 },
    { source: 'Email', rate: 7.5, change: 2.1 },
  ],
  byDevice: [
    { device: 'Desktop', rate: 4.7, change: 0.8 },
    { device: 'Mobile', rate: 3.2, change: 0.3 },
    { device: 'Tablet', rate: 3.9, change: -0.1 },
  ]
};

// Mock data for abandoned carts
const ABANDONED_CARTS = [
  { id: 'AC1234', customer: 'Sarah Johnson', email: 'sarah@example.com', items: 3, value: 245.99, time: '2 hours ago' },
  { id: 'AC1235', customer: 'Michael Brown', email: 'michael@example.com', items: 1, value: 89.99, time: '4 hours ago' },
  { id: 'AC1236', customer: 'Emily Davis', email: 'emily@example.com', items: 5, value: 378.50, time: '6 hours ago' },
  { id: 'AC1237', customer: 'James Wilson', email: 'james@example.com', items: 2, value: 124.75, time: '12 hours ago' },
  { id: 'AC1238', customer: 'Jessica Taylor', email: 'jessica@example.com', items: 4, value: 312.25, time: '1 day ago' },
];

// Mock data for bestsellers
const BESTSELLERS = [
  { id: 'P1001', name: 'Cozy Corner Sofa', category: 'Living Room', sold: 56, revenue: 19600, growth: 12 },
  { id: 'P1002', name: 'Ergonomic Office Chair', category: 'Office', sold: 48, revenue: 9600, growth: 8 },
  { id: 'P1003', name: 'Memory Foam Mattress', category: 'Bedroom', sold: 42, revenue: 12600, growth: 15 },
  { id: 'P1004', name: 'Extendable Dining Table', category: 'Dining', sold: 38, revenue: 15200, growth: -2 },
  { id: 'P1005', name: 'Adjustable Standing Desk', category: 'Office', sold: 34, revenue: 13600, growth: 22 },
];

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [conversionTimeframe, setConversionTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Analytics</h1>
        <p className="text-muted-foreground mt-2">View detailed performance metrics and visitor data.</p>
      </div>
      
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Analytics</TabsTrigger>
          <TabsTrigger value="products">Products & Sales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visitors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{VISITOR_DATA.today.count}</div>
                    <div className="flex items-center text-xs mt-1">
                      {VISITOR_DATA.today.change > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">+{VISITOR_DATA.today.change}% from yesterday</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">{VISITOR_DATA.today.change}% from yesterday</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-furniture-accent opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{VISITOR_DATA.week.count}</div>
                    <div className="flex items-center text-xs mt-1">
                      {VISITOR_DATA.week.change > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">+{VISITOR_DATA.week.change}% from last week</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">{VISITOR_DATA.week.change}% from last week</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-furniture-accent opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{VISITOR_DATA.month.count}</div>
                    <div className="flex items-center text-xs mt-1">
                      {VISITOR_DATA.month.change > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">+{VISITOR_DATA.month.change}% from last month</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">{VISITOR_DATA.month.change}% from last month</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-furniture-accent opacity-70" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
              <CardDescription>Visitor count over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <BarChart3 className="h-40 w-40 opacity-50 mb-4" />
                <p>Visitor trend chart visualization would appear here</p>
                <p className="text-sm mt-2">Showing data for the last 30 days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRAFFIC_SOURCES.map((source) => (
                    <TableRow key={source.source}>
                      <TableCell className="font-medium">{source.source}</TableCell>
                      <TableCell className="text-right">{source.visits}</TableCell>
                      <TableCell className="text-right">{source.percentage}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {source.change > 0 ? (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500">+{source.change}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-500">{source.change}%</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Most Visited Pages</CardTitle>
              <CardDescription>Pages with the highest traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                    <TableHead className="text-right">Avg. Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TOP_PAGES.map((page) => (
                    <TableRow key={page.path}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{page.path}</TableCell>
                      <TableCell className="text-right">{page.visits}</TableCell>
                      <TableCell className="text-right">{page.avgTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Conversion Performance</h2>
            <Select value={conversionTimeframe} onValueChange={(value: 'week' | 'month' | 'quarter') => setConversionTimeframe(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{CONVERSION_DATA.overall.rate}%</div>
                    <div className="flex items-center text-xs mt-1">
                      {CONVERSION_DATA.overall.change > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">+{CONVERSION_DATA.overall.change}% from previous period</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">{CONVERSION_DATA.overall.change}% from previous period</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Percent className="h-8 w-8 text-green-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Abandoned Cart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">24.3%</div>
                    <div className="flex items-center text-xs mt-1">
                      <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">-2.1% from previous period</span>
                    </div>
                  </div>
                  <AlertCircle className="h-8 w-8 text-amber-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Order Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">4:32</div>
                    <div className="flex items-center text-xs mt-1">
                      <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">-0:18 from previous period</span>
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500 opacity-70" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion by Traffic Source</CardTitle>
                <CardDescription>How different traffic sources convert</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Conversion Rate</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CONVERSION_DATA.bySource.map((source) => (
                      <TableRow key={source.source}>
                        <TableCell className="font-medium">{source.source}</TableCell>
                        <TableCell className="text-right">{source.rate}%</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {source.change > 0 ? (
                              <>
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500">+{source.change}%</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-500">{source.change}%</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion by Device</CardTitle>
                <CardDescription>How different devices convert</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead className="text-right">Conversion Rate</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CONVERSION_DATA.byDevice.map((device) => (
                      <TableRow key={device.device}>
                        <TableCell className="font-medium">{device.device}</TableCell>
                        <TableCell className="text-right">{device.rate}%</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {device.change > 0 ? (
                              <>
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500">+{device.change}%</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-500">{device.change}%</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Abandoned Carts</CardTitle>
              <CardDescription>Customers who added items to cart but didn't complete checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Abandoned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ABANDONED_CARTS.map((cart) => (
                    <TableRow key={cart.id}>
                      <TableCell>
                        <div className="font-medium">{cart.customer}</div>
                        <div className="text-sm text-muted-foreground">{cart.email}</div>
                      </TableCell>
                      <TableCell>{cart.items} items</TableCell>
                      <TableCell>${cart.value.toFixed(2)}</TableCell>
                      <TableCell>{cart.time}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <MailIcon className="h-4 w-4 mr-2" />
                          Send Reminder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">View All Abandoned Carts</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">3.8%</div>
                    <div className="flex items-center text-xs mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">+0.5% from last month</span>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">142</div>
                    <div className="flex items-center text-xs mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">+12% from last month</span>
                    </div>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">$45,672</div>
                    <div className="flex items-center text-xs mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">+8% from last month</span>
                    </div>
                  </div>
                  <ReceiptText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Best-Selling Products</CardTitle>
                  <CardDescription>Top performing products by sales volume</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BESTSELLERS.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{product.sold}</TableCell>
                      <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {product.growth > 0 ? (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500">+{product.growth}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-500">{product.growth}%</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Products Analytics</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Categories Performance</CardTitle>
              <CardDescription>Sales distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <ShoppingBag className="h-40 w-40 opacity-50 mb-4" />
                <p>Product category performance chart would appear here</p>
                <p className="text-sm mt-2">Showing sales distribution by product category</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
