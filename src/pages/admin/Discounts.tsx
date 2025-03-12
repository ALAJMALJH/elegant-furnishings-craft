
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiscountList from '@/components/Admin/Discounts/DiscountList';
import DiscountForm from '@/components/Admin/Discounts/DiscountForm';
import DiscountAnalytics from '@/components/Admin/Discounts/DiscountAnalytics';
import DiscountSearch from '@/components/Admin/Discounts/DiscountSearch';
import { DiscountCode, DiscountStats } from '@/components/Admin/Discounts/types';

// Data for analytics section
const discountStats: DiscountStats = {
  active: 3,
  totalRedemptions: 1247,
  revenue: 125680
};

const Discounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

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
            <DiscountSearch 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
            />
            
            <DiscountForm />
          </div>
          
          <DiscountList 
            discounts={discounts || []}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filterCategory={filterCategory}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <DiscountAnalytics stats={discountStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Discounts;
