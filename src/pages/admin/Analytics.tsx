
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VisitCount {
  date: string;
  count: number;
}

interface SourceData {
  name: string;
  value: number;
}

interface PageData {
  page_path: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
  const [visitCounts, setVisitCounts] = useState<VisitCount[]>([]);
  const [sourceCounts, setSourceCounts] = useState<SourceData[]>([]);
  const [topPages, setTopPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      if (timeRange === 'day') {
        startDate.setDate(now.getDate() - 1);
      } else if (timeRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      try {
        // Fetch daily visit counts
        const { data: visitData, error: visitError } = await supabase
          .from('page_visits')
          .select('created_at')
          .gte('created_at', startDate.toISOString());
          
        if (visitError) throw visitError;
        
        // Process visit data by day
        const countsByDate: Record<string, number> = {};
        visitData.forEach(visit => {
          const date = new Date(visit.created_at).toLocaleDateString();
          countsByDate[date] = (countsByDate[date] || 0) + 1;
        });
        
        const formattedVisitCounts = Object.entries(countsByDate).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setVisitCounts(formattedVisitCounts);
        
        // Fetch traffic sources
        const { data: sourceData, error: sourceError } = await supabase
          .from('page_visits')
          .select('source')
          .gte('created_at', startDate.toISOString());
          
        if (sourceError) throw sourceError;
        
        // Process source data
        const countsBySource: Record<string, number> = {};
        sourceData.forEach(visit => {
          const source = visit.source || 'unknown';
          countsBySource[source] = (countsBySource[source] || 0) + 1;
        });
        
        const formattedSourceCounts = Object.entries(countsBySource).map(([name, value]) => ({
          name,
          value
        }));
        
        setSourceCounts(formattedSourceCounts);
        
        // Fetch top pages
        const { data: pageData, error: pageError } = await supabase
          .from('page_visits')
          .select('page_path')
          .gte('created_at', startDate.toISOString());
          
        if (pageError) throw pageError;
        
        // Process page data
        const countsByPage: Record<string, number> = {};
        pageData.forEach(visit => {
          const page = visit.page_path;
          countsByPage[page] = (countsByPage[page] || 0) + 1;
        });
        
        const formattedPageCounts = Object.entries(countsByPage)
          .map(([page_path, count]) => ({ page_path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setTopPages(formattedPageCounts);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Analytics</h1>
      <p className="text-muted-foreground mt-2">View detailed performance metrics for your store.</p>
      
      <div className="mt-4">
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month')}>
          <TabsList>
            <TabsTrigger value="day">Last 24 Hours</TabsTrigger>
            <TabsTrigger value="week">Last 7 Days</TabsTrigger>
            <TabsTrigger value="month">Last 30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Visitors Over Time */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Visitors Over Time</CardTitle>
            <CardDescription>Daily visitor counts</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            ) : visitCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitCounts} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Visitors" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No visitor data available for this time period.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            ) : sourceCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No source data available for this time period.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p>Loading data...</p>
              </div>
            ) : topPages.length > 0 ? (
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="text-sm truncate max-w-[70%]" title={page.page_path}>
                      {page.page_path === '/' ? 'Home Page' : page.page_path}
                    </div>
                    <div className="text-sm font-semibold bg-muted px-2 py-1 rounded">
                      {page.count} visits
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No page data available for this time period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
