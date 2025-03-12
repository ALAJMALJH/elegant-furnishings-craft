
import React, { useState, useEffect } from "react";
import ProductCard from "../UI/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  category: string;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
}

const BestsellerSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Set up realtime subscription for products table
  useRealtimeSubscription(
    [{ table: 'products', event: '*' }],
    {
      products: () => {
        console.log('Products updated, refreshing data...');
        fetchProducts();
      }
    },
    false // Disable toast notifications
  );

  const getBadge = (product: Product) => {
    if (product.is_bestseller) return "Bestseller";
    if (product.is_new_arrival) return "New";
    if (product.is_on_sale) return "Limited";
    return undefined;
  };

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title">Bestsellers & Trending</h2>
          <p className="section-subtitle">Our most loved pieces, handpicked for you</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-100 animate-pulse h-64 rounded-lg"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url}
                category={product.category}
                badge={getBadge(product)}
                originalPrice={product.discount_price ? product.price : undefined}
                delay={index * 100}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestsellerSection;
