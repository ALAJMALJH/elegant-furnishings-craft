
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ArrowDownRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Analytics</h1>
        <p className="text-muted-foreground mt-2">View detailed performance metrics and visitor data.</p>
      </div>
      
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
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
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-4">
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
        
        <TabsContent value="products" className="space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Products with the most views and sales</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <ShoppingBag className="h-40 w-40 opacity-50 mb-4" />
                <p>Top products visualization would appear here</p>
                <p className="text-sm mt-2">Data would be populated from real product views and sales</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
