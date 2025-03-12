
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
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const statsCards = [
  {
    title: "Total Sales",
    value: "$12,456",
    change: "+12% from last month",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Visitors",
    value: "2,345",
    change: "+5% from last week",
    icon: Users,
    trend: "up",
  },
  {
    title: "Orders",
    value: "345",
    change: "-3% from yesterday",
    icon: ShoppingBag,
    trend: "down",
  },
  {
    title: "Stock Items",
    value: "436",
    change: "12 items low in stock",
    icon: Package,
    trend: "neutral",
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-furniture-dark">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your admin dashboard.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, i) => (
          <Card key={i} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${
                card.trend === 'up' 
                  ? 'text-green-500' 
                  : card.trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs mt-1 ${
                card.trend === 'up' 
                  ? 'text-green-500' 
                  : card.trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-muted-foreground'
              }`}>
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
                Sales chart visualization would appear here
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
            <div className="space-y-4">
              {[
                { text: "New order #2354 received", time: "5 minutes ago", icon: ShoppingBag },
                { text: "Stock updated for 3 products", time: "2 hours ago", icon: Package },
                { text: "New customer registered", time: "Yesterday", icon: Users },
                { text: "Sales report generated", time: "2 days ago", icon: Calendar },
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="p-2 mr-3 bg-muted rounded-full">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
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
            <div className="space-y-4">
              {[
                { name: "Modern Wooden Sofa", sales: 34, revenue: "$4,523" },
                { name: "Luxurious Bed Frame", sales: 28, revenue: "$6,230" },
                { name: "Elegant Dining Table", sales: 22, revenue: "$3,450" },
                { name: "Minimalist Office Chair", sales: 19, revenue: "$2,850" },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <p className="text-sm font-semibold">{product.revenue}</p>
                </div>
              ))}
            </div>
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
                { label: "New Customers", value: "143", icon: Users, change: "+22%" },
                { label: "Returning Rate", value: "64%", icon: TrendingUp, change: "+5%" },
                { label: "Avg. Order Value", value: "$245", icon: DollarSign, change: "+12%" },
                { label: "Conversion Rate", value: "3.2%", icon: ShoppingBag, change: "+0.5%" },
              ].map((metric, i) => (
                <div key={i} className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <metric.icon className="h-4 w-4 text-furniture-accent" />
                    <span className="text-xs font-medium">{metric.label}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold">{metric.value}</span>
                    <span className="text-xs text-green-500 ml-2">{metric.change}</span>
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
    </div>
  );
};

export default Dashboard;
