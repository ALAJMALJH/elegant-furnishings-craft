
// Define the types for products
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory: string | null;
  image_url: string;
  discount_price: number | null;
  stock_quantity: number;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  created_at: string;
  updated_at: string;
}

// Context interface
export interface ProductSyncContextType {
  products: Product[];
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  newArrivals: Product[];
  onSaleProducts: Product[];
  categories: Map<string, { count: number; image: string }>;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}
