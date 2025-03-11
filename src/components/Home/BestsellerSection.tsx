
import React from "react";
import ProductCard from "../UI/ProductCard";

const products = [
  {
    id: "p1",
    name: "Elegant Comfort Sofa",
    price: 3499,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    category: "Living Room",
    badge: "Bestseller",
  },
  {
    id: "p2",
    name: "Modern Oak Dining Table",
    price: 2899,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    category: "Dining",
    badge: "Limited",
  },
  {
    id: "p3",
    name: "Luxe King Size Bed",
    price: 5299,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    category: "Bedroom",
    badge: "Trending",
  },
  {
    id: "p4",
    name: "Executive Office Chair",
    price: 1299,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "Office",
    badge: "New",
  },
  {
    id: "p5",
    name: "Artisan Coffee Table",
    price: 1899,
    originalPrice: 2399,
    image: "https://images.unsplash.com/photo-1601392740426-907c7b028119",
    category: "Living Room",
    badge: "Bestseller",
  },
  {
    id: "p6",
    name: "Premium Outdoor Set",
    price: 4599,
    image: "https://images.unsplash.com/photo-1605365070248-299a182a9ca4",
    category: "Outdoor",
    badge: "Limited",
  },
  {
    id: "p7",
    name: "Designer Bookshelf",
    price: 2499,
    image: "https://images.unsplash.com/photo-1588329943841-56eb1a3480a5",
    category: "Living Room",
    badge: "New",
  },
  {
    id: "p8",
    name: "Marble Console Table",
    price: 1799,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
    category: "Living Room",
    badge: "Trending",
  },
];

const BestsellerSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title">Bestsellers & Trending</h2>
          <p className="section-subtitle">Our most loved pieces, handpicked for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              badge={product.badge}
              originalPrice={product.originalPrice}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestsellerSection;
