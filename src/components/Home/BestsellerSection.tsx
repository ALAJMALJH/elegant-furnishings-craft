
import React from "react";
import ProductCard from "../UI/ProductCard";
import { useProductSync } from "@/contexts/ProductSyncContext";

const BestsellerSection = () => {
  const { bestsellerProducts, isLoading } = useProductSync();

  const getBadge = (product: any) => {
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
        ) : bestsellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bestsellerProducts.slice(0, 8).map((product, index) => (
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
            <p className="text-gray-500">No bestseller products found. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestsellerSection;
