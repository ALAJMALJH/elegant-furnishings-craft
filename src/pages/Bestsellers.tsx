
import React, { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/UI/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, Star, Filter } from "lucide-react";

// Bestseller products data
const bestsellers = [
  {
    id: "p1",
    name: "Elegant Comfort Sofa",
    price: 3499,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    category: "Living Room",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 124,
  },
  {
    id: "p2",
    name: "Modern Oak Dining Table",
    price: 2899,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    category: "Dining",
    badge: "Limited",
    rating: 4.8,
    reviews: 98,
  },
  {
    id: "p3",
    name: "Luxe King Size Bed",
    price: 5299,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    category: "Bedroom",
    badge: "Trending",
    rating: 4.9,
    reviews: 116,
  },
  {
    id: "p4",
    name: "Executive Office Chair",
    price: 1299,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "Office",
    badge: "New",
    rating: 4.7,
    reviews: 87,
  },
  {
    id: "p5",
    name: "Artisan Coffee Table",
    price: 1899,
    originalPrice: 2399,
    image: "https://images.unsplash.com/photo-1601392740426-907c7b028119",
    category: "Living Room",
    badge: "Bestseller",
    rating: 4.8,
    reviews: 107,
  },
  {
    id: "p6",
    name: "Premium Outdoor Set",
    price: 4599,
    image: "https://images.unsplash.com/photo-1605365070248-299a182a9ca4",
    category: "Outdoor",
    badge: "Limited",
    rating: 4.9,
    reviews: 93,
  },
  {
    id: "p7",
    name: "Designer Bookshelf",
    price: 2499,
    image: "https://images.unsplash.com/photo-1588329943841-56eb1a3480a5",
    category: "Living Room",
    badge: "New",
    rating: 4.7,
    reviews: 78,
  },
  {
    id: "p8",
    name: "Marble Console Table",
    price: 1799,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
    category: "Living Room",
    badge: "Trending",
    rating: 4.8,
    reviews: 84,
  },
  {
    id: "p9",
    name: "Plush Accent Chair",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
    category: "Living Room",
    badge: "Bestseller",
    rating: 4.8,
    reviews: 112,
  },
  {
    id: "p10",
    name: "Rustic Dining Bench",
    price: 999,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    category: "Dining",
    badge: "New",
    rating: 4.6,
    reviews: 73,
  },
  {
    id: "p11",
    name: "Luxury Wardrobe",
    price: 4299,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    category: "Bedroom",
    badge: "Trending",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "p12",
    name: "Modern Desk Lamp",
    price: 349,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    category: "Office",
    badge: "Sale",
    rating: 4.8,
    reviews: 95,
  },
];

// Filter options
const categories = ["All", "Living Room", "Bedroom", "Dining", "Office", "Outdoor"];
const ratings = [5, 4, 3, 2, 1];
const priceRanges = ["All", "Under AED 1,000", "AED 1,000-2,500", "AED 2,500-5,000", "Over AED 5,000"];

// Featured reviews
const featuredReviews = [
  {
    id: 1,
    name: "Mohammed Al Farsi",
    date: "July 15, 2023",
    rating: 5,
    title: "Exceptional Quality Sofa",
    text: "The Elegant Comfort Sofa exceeds all expectations. The quality of the fabric is superb, and the cushioning provides perfect support. It has transformed our living room completely.",
    productName: "Elegant Comfort Sofa",
    productImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  },
  {
    id: 2,
    name: "Priya Sharma",
    date: "August 3, 2023",
    rating: 5,
    title: "Beautiful Dining Table",
    text: "This Modern Oak Dining Table is not only sturdy but also a statement piece in our home. The craftsmanship is exceptional, and we receive compliments from every guest.",
    productName: "Modern Oak Dining Table",
    productImage: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
  },
  {
    id: 3,
    name: "Daniel Clark",
    date: "June 22, 2023",
    rating: 5,
    title: "Worth Every Penny",
    text: "The Luxe King Size Bed is the best furniture investment we've made. The quality is outstanding, and the design is timeless. Sleeping has never been more comfortable.",
    productName: "Luxe King Size Bed",
    productImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

const Bestsellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products based on selected filters
  const filteredProducts = bestsellers.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = selectedRating === 0 || product.rating >= selectedRating;
    
    return matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1567016432779-094069958ea5"
            alt="Bestseller Furniture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent rounded-full mb-6">
              Customer Favorites
            </span>
            <h1 className="text-5xl md:text-6xl font-playfair font-semibold leading-tight mb-6">
              Our Bestsellers
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Discover our most loved furniture pieces, handpicked based on customer ratings and popularity.
            </p>
          </div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-12 bg-furniture-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <h2 className="text-3xl font-playfair font-semibold mb-4">The Most Popular Choices</h2>
            <p className="text-lg text-furniture-accent2">
              These exceptional pieces have won the hearts of our customers through superior quality, timeless design, and exceptional comfort. Each bestseller has earned its place through consistently positive reviews and repeat purchases.
            </p>
          </div>
        </div>
      </section>
      
      {/* Products Section with Filters */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <button 
              className="lg:hidden flex items-center justify-center space-x-2 py-3 px-4 border border-furniture-muted rounded-lg"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <Filter size={18} />
              <span>Filters {mobileFiltersOpen ? '(Hide)' : '(Show)'}</span>
            </button>
            
            {/* Filters Sidebar */}
            <div className={`lg:w-1/4 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-lg custom-shadow sticky top-32">
                <h3 className="text-xl font-playfair font-semibold mb-6">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4">Category</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          className="hidden"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                        />
                        <span className={`w-4 h-4 rounded-full border ${
                          selectedCategory === category 
                            ? 'border-furniture-accent bg-furniture-accent' 
                            : 'border-furniture-muted'
                        } flex items-center justify-center mr-3`}>
                          {selectedCategory === category && (
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                          )}
                        </span>
                        <span className="text-furniture-dark">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 6000]}
                      max={6000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>AED {priceRange[0]}</span>
                      <span>AED {priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div>
                  <h4 className="text-lg font-medium mb-4">Rating</h4>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        checked={selectedRating === 0}
                        onChange={() => setSelectedRating(0)}
                      />
                      <span className={`w-4 h-4 rounded-full border ${
                        selectedRating === 0 
                          ? 'border-furniture-accent bg-furniture-accent' 
                          : 'border-furniture-muted'
                      } flex items-center justify-center mr-3`}>
                        {selectedRating === 0 && (
                          <span className="w-2 h-2 rounded-full bg-white"></span>
                        )}
                      </span>
                      <span className="text-furniture-dark">All Ratings</span>
                    </label>
                    
                    {ratings.map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          className="hidden"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                        />
                        <span className={`w-4 h-4 rounded-full border ${
                          selectedRating === rating 
                            ? 'border-furniture-accent bg-furniture-accent' 
                            : 'border-furniture-muted'
                        } flex items-center justify-center mr-3`}>
                          {selectedRating === rating && (
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                          )}
                        </span>
                        <div className="flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} size={16} className="text-gray-300" />
                          ))}
                          <span className="ml-1">& Up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 6000]);
                    setSelectedRating(0);
                  }}
                  className="mt-8 w-full py-2 border border-furniture-accent text-furniture-accent rounded hover:bg-furniture-accent hover:text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="lg:w-3/4">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-8">
                  <TabsList>
                    <TabsTrigger value="all">All Bestsellers</TabsTrigger>
                    <TabsTrigger value="limited">Limited Edition</TabsTrigger>
                    <TabsTrigger value="trending">Trending Now</TabsTrigger>
                    <TabsTrigger value="new">New Arrivals</TabsTrigger>
                  </TabsList>
                  
                  <select className="bg-white border border-furniture-muted rounded px-3 py-2 text-sm">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Customer Rating</option>
                    <option>Newest First</option>
                  </select>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-furniture-light rounded-lg">
                      <p className="text-lg text-furniture-accent2">No products match your current filters.</p>
                      <button
                        onClick={() => {
                          setSelectedCategory("All");
                          setPriceRange([0, 6000]);
                          setSelectedRating(0);
                        }}
                        className="mt-4 px-6 py-2 bg-furniture-accent text-furniture-dark rounded hover:bg-furniture-accent/90 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product, index) => (
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
                  )}
                </TabsContent>
                
                <TabsContent value="limited" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestsellers
                      .filter(product => product.badge === "Limited")
                      .map((product, index) => (
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
                </TabsContent>
                
                <TabsContent value="trending" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestsellers
                      .filter(product => product.badge === "Trending")
                      .map((product, index) => (
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
                </TabsContent>
                
                <TabsContent value="new" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestsellers
                      .filter(product => product.badge === "New")
                      .map((product, index) => (
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      
      {/* Customer Reviews Section */}
      <section className="py-20 bg-furniture-light">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real feedback from our satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredReviews.map((review, index) => (
              <div 
                key={review.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'fade-up 0.7s ease-out forwards',
                }}
              >
                <div className="h-48 relative">
                  <img 
                    src={review.productImage} 
                    alt={review.productName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-medium">{review.productName}</h4>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-sm text-furniture-accent2">{review.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
                  <p className="text-furniture-accent2 text-sm mb-4">"{review.text}"</p>
                  
                  <div className="flex items-center pt-4 border-t border-furniture-muted">
                    <div className="w-8 h-8 rounded-full bg-furniture-accent flex items-center justify-center text-white font-medium">
                      {review.name.charAt(0)}
                    </div>
                    <span className="ml-2 font-medium">{review.name}</span>
                    <CheckCircle size={16} className="ml-auto text-emerald-500" />
                    <span className="text-xs text-emerald-500 ml-1">Verified Purchase</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Bestsellers;
