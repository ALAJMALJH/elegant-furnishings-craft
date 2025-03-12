
import React, { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/UI/ProductCard";
import { ChevronDown, Sofa, Bed, Table, LampDesk, TreeDeciduous, Filter, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

// Sample product data
const allProducts = [
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
  {
    id: "p9",
    name: "Plush Sectional Sofa",
    price: 4899,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
    category: "Living Room",
    badge: "New",
  },
  {
    id: "p10",
    name: "Handcrafted Dining Chairs (Set of 4)",
    price: 2199,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7",
    category: "Dining",
    badge: "Bestseller",
  },
  {
    id: "p11",
    name: "Queen Sleigh Bed",
    price: 3799,
    image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15",
    category: "Bedroom",
    badge: "Limited",
  },
  {
    id: "p12",
    name: "Modern Writing Desk",
    price: 1499,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd",
    category: "Office",
    badge: "Trending",
  },
];

// Category data with icons
const categories = [
  { name: "Living Room", path: "/category/living-room", icon: Sofa },
  { name: "Bedroom", path: "/category/bedroom", icon: Bed },
  { name: "Dining", path: "/category/dining", icon: Table },
  { name: "Office", path: "/category/office", icon: LampDesk },
  { name: "Outdoor", path: "/category/outdoor", icon: TreeDeciduous },
];

const ShopAll = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter products based on selected criteria
  const filteredProducts = allProducts.filter(product => {
    // Filter by category
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort products based on selected criteria
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return 0; // In a real app, we would sort by date
      default: // featured
        return 0; // In a real app, this might have custom sorting logic
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Banner */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126"
              alt="Furniture Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
          </div>
          <div className="container-custom relative h-full flex flex-col justify-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-4 animate-fade-up">
              Shop All Collections
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white/90 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Discover our complete range of beautifully crafted furniture
            </p>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-10 bg-white border-b border-furniture-muted">
          <div className="container-custom">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-furniture-light transition-colors"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                      animation: 'fade-up 0.5s ease-out forwards',
                    }}
                  >
                    <div className="w-16 h-16 bg-furniture-light rounded-full flex items-center justify-center mb-3">
                      <Icon size={28} className="text-furniture-accent" />
                    </div>
                    <span className="text-furniture-dark font-medium text-center">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-furniture-light">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Mobile Filter Toggle */}
              <button 
                className="md:hidden flex items-center justify-center gap-2 bg-white p-3 rounded-md shadow-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={20} />
                <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
              
              {/* Filters Sidebar */}
              <div className={`md:w-64 lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Filter size={20} className="mr-2" /> Filters
                  </h2>
                  
                  {/* Category Filter */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Category</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === null}
                          onChange={() => setSelectedCategory(null)}
                          className="w-4 h-4 text-furniture-accent focus:ring-furniture-accent"
                        />
                        <span>All Categories</span>
                      </label>
                      {categories.map(category => (
                        <label key={category.name} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.name}
                            onChange={() => setSelectedCategory(category.name)}
                            className="w-4 h-4 text-furniture-accent focus:ring-furniture-accent"
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>AED {priceRange[0]}</span>
                        <span>AED {priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6000"
                        step="500"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-furniture-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full p-2 border border-furniture-muted rounded-md focus:outline-none focus:ring-1 focus:ring-furniture-accent"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Products Grid */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-playfair font-semibold">
                    {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
                  </h2>
                  
                  {/* Desktop Sort */}
                  <div className="hidden md:flex items-center">
                    <span className="mr-3 text-furniture-accent2">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="p-2 border border-furniture-muted rounded-md focus:outline-none focus:ring-1 focus:ring-furniture-accent"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
                
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product, index) => (
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
                ) : (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-lg text-furniture-accent2">No products match your selected filters.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setPriceRange([0, 6000]);
                        setSortBy("featured");
                      }}
                      className="mt-4 px-4 py-2 bg-furniture-accent text-furniture-dark rounded-md"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-playfair font-semibold mb-10 text-center">Featured Collections</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-80 rounded-lg overflow-hidden group animate-fade-up">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
                  alt="New Arrivals"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-playfair font-semibold text-white mb-2">New Arrivals</h3>
                  <p className="text-white/80 mb-4">The latest additions to our collection</p>
                  <Link
                    to="/shop?filter=new"
                    className="px-6 py-2 bg-furniture-accent text-furniture-dark font-medium rounded-md inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
              
              <div className="relative h-80 rounded-lg overflow-hidden group animate-fade-up" style={{ animationDelay: "150ms" }}>
                <img
                  src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe"
                  alt="Summer Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-playfair font-semibold text-white mb-2">Summer Collection</h3>
                  <p className="text-white/80 mb-4">Bright and breezy pieces for your home</p>
                  <Link
                    to="/shop?collection=summer"
                    className="px-6 py-2 bg-furniture-accent text-furniture-dark font-medium rounded-md inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-furniture-dark text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-playfair font-semibold mb-4">Stay Updated</h2>
              <p className="text-white/80 mb-8">
                Subscribe to our newsletter to receive updates on new arrivals, special offers, and design inspiration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-md focus:outline-none text-black"
                />
                <button className="px-6 py-3 bg-furniture-accent text-furniture-dark font-medium rounded-md whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopAll;
