
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CopyCheck } from 'lucide-react';

interface DiscountStatsType {
  active: number;
  totalRedemptions: number;
  revenue: number;
}

interface DiscountAnalyticsProps {
  stats: DiscountStatsType;
}

const DiscountAnalytics: React.FC<DiscountAnalyticsProps> = ({ stats }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Active Discounts" 
          value={stats.active} 
          description="Currently running" 
        />
        <StatCard 
          title="Total Redemptions" 
          value={stats.totalRedemptions} 
          description="All time" 
        />
        <StatCard 
          title="Revenue with Discounts" 
          value={`$${stats.revenue.toLocaleString()}`} 
          description="From discounted orders" 
        />
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
    </>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </CardContent>
    </Card>
  );
};

export default DiscountAnalytics;
