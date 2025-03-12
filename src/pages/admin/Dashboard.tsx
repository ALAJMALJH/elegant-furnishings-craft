
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  Calendar, 
  ChevronRight,
  Bell,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminRealtime } from '@/contexts/AdminRealtimeContext';
import RealtimeDashboardStats from '@/components/Admin/RealtimeDashboardStats';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard: React.FC = () => {
  const { refreshData } = useAdminRealtime();
  
  // Fetch top selling products
  const { data: topProducts } = useQuery({
    queryKey: ['topProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          products:product_id (
            name,
            price
          )
        `)
        .order('quantity', { ascending: false })
        .limit(4);

      if (error) throw error;

      // Group by product and calculate totals
      const productTotals = data.reduce((acc: any, item: any) => {
        if (!acc[item.product_id]) {
          acc[item.product_id] = {
            name: item.products.name,
            sales: 0,
            revenue: 0
          };
        }
        acc[item.product_id].sales += item.quantity;
        acc[item.product_id].revenue += item.quantity * item.products.price;
        return acc;
      }, {});

      return Object.values(productTotals);
    }
  });

  // Fetch customer insights
  const { data: customerStats } = useQuery({
    queryKey: ['customerStats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('customer_email, created_at')
        .gt('created_at', today.toISOString());

      if (error) throw error;

      const uniqueCustomers = new Set(orders.map(order => order.customer_email));
      
      return {
        newToday: uniqueCustomers.size,
        total: orders.length,
        avgOrderValue: orders.length ? (orders.reduce((sum: number, order: any) => sum + order.total_amount, 0) / orders.length).toFixed(2) : 0,
        returningRate: '0%' // This would need more complex logic with historical data
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-furniture-dark">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your admin dashboard.</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => refreshData()}
          className="mt-2 md:mt-0"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      
      {/* Real-time Stats Section */}
      <RealtimeDashboardStats />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Sales", value: "$0", change: "No sales yet", icon: DollarSign, trend: "neutral" },
              { title: "Visitors", value: "0", change: "Awaiting first visitor", icon: Users, trend: "neutral" },
              { title: "Orders", value: "0", change: "No orders yet", icon: ShoppingBag, trend: "neutral" },
              { title: "Stock Items", value: "0", change: "No items in stock", icon: Package, trend: "neutral" },
            ].map((card, i) => (
              <Card key={i} className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {card.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="h-40 w-40 text-muted-foreground/50" />
                  <p className="text-center text-muted-foreground">
                    Sales data will appear here as orders are placed
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest store activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity to display
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Monthly best performers</CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts && topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.map((product: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                        </div>
                        <p className="text-sm font-semibold">${product.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No sales data available yet
                  </div>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    to="/admin/products" 
                    className="flex items-center text-sm text-furniture-accent hover:text-furniture-accent2"
                  >
                    View all products
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>User engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      label: "New Customers", 
                      value: customerStats?.newToday || '0',
                      icon: Users, 
                      change: "today" 
                    },
                    { 
                      label: "Total Orders", 
                      value: customerStats?.total || '0', 
                      icon: TrendingUp, 
                      change: "all time" 
                    },
                    { 
                      label: "Avg. Order Value", 
                      value: customerStats?.avgOrderValue ? `$${customerStats.avgOrderValue}` : '$0', 
                      icon: DollarSign, 
                      change: "per order" 
                    },
                    { 
                      label: "Returning Rate", 
                      value: customerStats?.returningRate || '0%', 
                      icon: ShoppingBag, 
                      change: "customers" 
                    },
                  ].map((metric, i) => (
                    <div key={i} className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium">{metric.label}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xl font-bold">{metric.value}</span>
                        <span className="text-xs text-muted-foreground ml-2">{metric.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    to="/admin/customers" 
                    className="flex items-center text-sm text-furniture-accent hover:text-furniture-accent2"
                  >
                    View customer details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed metrics will appear here as data becomes available</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <BarChart3 className="h-40 w-40 text-muted-foreground/50" />
                <p className="text-center text-muted-foreground">
                  Analytics data will populate as your store generates activity
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No notifications to display
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Mark All as Read
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
