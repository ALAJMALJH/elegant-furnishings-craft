
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

export interface AbandonedCartNotification {
  id: string;
  cart_id: string;
  customer_email: string;
  notification_type: 'abandoned_cart' | 'price_drop' | 'back_in_stock';
  status: 'pending' | 'sent' | 'failed';
  sent_at: string | null;
}

// Product variant and inventory types
export interface ProductVariant {
  id: string;
  name: string;
  attributes: {
    [key: string]: string; // e.g. { "color": "red", "size": "large" }
  };
  price: number;
  discount_price: number | null;
  sku: string;
  stock_quantity: number;
  image_url?: string;
}

export interface ProductCollection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity_change: number;
  transaction_type: 'restock' | 'sale' | 'return' | 'adjustment';
  reference_id: string | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  image_url: string;
  latitude: number;
  longitude: number;
  phone: string;
  opening_hours: string;
}

// Add Json type from Supabase for type compatibility
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
