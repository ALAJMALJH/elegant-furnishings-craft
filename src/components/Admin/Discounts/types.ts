
// Define the Json type for Supabase compatibility
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Product variant interface
export interface ProductVariant {
  id: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  discount_price: number | null;
  sku: string;
  stock_quantity: number;
  image_url?: string;
}

// Product collection interface
export interface ProductCollection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// Inventory transaction types
export type TransactionType = 'restock' | 'sale' | 'return' | 'adjustment';

export interface InventoryTransaction {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity_change: number;
  transaction_type: TransactionType;
  reference_id?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

// Discount code interface
export interface DiscountCode {
  id: string;
  code: string;
  type: string;
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
