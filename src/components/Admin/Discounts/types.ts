
export interface DiscountCode {
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

export type DiscountFormData = Omit<DiscountCode, 'id' | 'created_at' | 'updated_at' | 'usage_count'> & {
  id?: string;
  usage_count?: number;
};

export interface DiscountStats {
  active: number;
  totalRedemptions: number;
  revenue: number;
}
