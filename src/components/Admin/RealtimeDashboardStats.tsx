
import React from 'react';
import { RefreshCw, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useAdminRealtime } from '@/contexts/AdminRealtimeContext';

const RealtimeDashboardStats: React.FC = () => {
  const { 
    productStats, 
    orderStats, 
    customerStats, 
    refreshData, 
    lastRefreshed,
    realtimeEnabled,
    toggleRealtime
  } = useAdminRealtime();

  // Format the last refreshed time
  const formattedLastRefreshed = lastRefreshed 
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(lastRefreshed)
    : 'Never';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-furniture-dark">Live Dashboard Statistics</h2>
          <p className="text-sm text-muted-foreground">
            {realtimeEnabled 
              ? 'Real-time updates enabled' 
              : 'Real-time updates disabled'}
            {' • '}Last updated: {formattedLastRefreshed}
          </p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRealtime}
          >
            {realtimeEnabled ? 'Disable' : 'Enable'} Real-time
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshData()}
            className="space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Now</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Orders Card */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Order Status
            </CardTitle>
            <ShoppingBag className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {orderStats.processing} Processing
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Orders waiting to be shipped
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {orderStats.shipped} Shipped
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Orders in transit
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {orderStats.delivered} Delivered
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Successfully delivered orders
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      {orderStats.cancelled} Cancelled
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cancelled orders
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
        
        {/* Products Card */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Product Inventory
            </CardTitle>
            <Package className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats.total}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {productStats.lowStock > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        {productStats.lowStock} Low Stock
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Products with 5 or fewer items left
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {productStats.outOfStock > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        {productStats.outOfStock} Out of Stock
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Products with zero inventory
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {productStats.lowStock === 0 && productStats.outOfStock === 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  All In Stock
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Customers Card */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Activity
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.total}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {customerStats.newToday > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {customerStats.newToday} New Today
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Alerts Card */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Alerts
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productStats.lowStock + productStats.outOfStock}
            </div>
            <div className="mt-2 space-y-1">
              {productStats.lowStock > 0 && (
                <div className="text-xs text-yellow-600">
                  {productStats.lowStock} products need restocking soon
                </div>
              )}
              {productStats.outOfStock > 0 && (
                <div className="text-xs text-red-600">
                  {productStats.outOfStock} products are completely out of stock
                </div>
              )}
              {productStats.lowStock === 0 && productStats.outOfStock === 0 && (
                <div className="text-xs text-green-600">
                  No immediate alerts at this time
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtimeDashboardStats;
