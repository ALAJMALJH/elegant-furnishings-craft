
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import { ChevronRight, ChevronLeft, Filter, ArrowUpDown, Check } from "lucide-react";
import BlogCard from "./BlogCard";

interface CategoryHero {
  title: string;
  subtitle: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  badge?: string;
}

export interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  image: string;
  productName: string;
}

export interface BlogPost {
  id: string; // Changed from number to string
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

interface CategoryPageProps {
  categorySlug: string;
  hero: CategoryHero;
  subcategories: Category[];
  featuredProducts: Product[];
  reviews: Review[];
  blogPosts: BlogPost[];
  customSectionTitle: string;
  customSectionDescription: string;
  customSectionImage: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  hero,
  subcategories,
  featuredProducts,
  reviews,
  blogPosts,
  customSectionTitle,
  customSectionDescription,
  customSectionImage,
}) => {
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeSubcategory, setActiveSubcategory] = React.useState<string | null>(null);
  
  const filteredProducts = React.useMemo(() => {
    if (!activeSubcategory) return featuredProducts;
    return featuredProducts.filter(product => 
      product.subcategory.toLowerCase() === activeSubcategory.toLowerCase()
    );
  }, [featuredProducts, activeSubcategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Banner */}
        <section 
          className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${hero.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-5xl text-white font-playfair font-semibold leading-tight mb-4">
                {hero.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">{hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  Shop All
                </Link>
                <Link
                  to={`/custom-furniture?category=${categorySlug}`}
                  className="inline-block px-6 py-3 border border-white text-white font-medium rounded transition-all duration-300 hover:bg-white/10"
                >
                  Custom Design
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Subcategories */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-8">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className={`p-4 border rounded-lg text-center transition-all hover:shadow-md ${
                    activeSubcategory === null 
                      ? "border-furniture-accent bg-furniture-accent/10" 
                      : "border-gray-200"
                  }`}
                >
                  All Products
                </button>
                {subcategories.map((subcat, index) => (
                  <button
                    key={subcat.id}
                    onClick={() => setActiveSubcategory(subcat.slug)}
                    className={`p-4 border rounded-lg text-center transition-all hover:shadow-md ${
                      activeSubcategory === subcat.slug 
                        ? "border-furniture-accent bg-furniture-accent/10" 
                        : "border-gray-200"
                    }`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                      animation: 'fade-up 0.5s ease-out forwards',
                    }}
                  >
                    {subcat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Products Section */}
        <section className="py-12 bg-furniture-light">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              {/* Filters - Mobile Toggle */}
              <div className="w-full md:hidden mb-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full py-3 px-4 border border-furniture-accent rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Filter size={18} className="mr-2" />
                    Filters
                  </span>
                  <ChevronRight 
                    size={18} 
                    className={`transition-transform ${showFilters ? "rotate-90" : ""}`} 
                  />
                </button>
              </div>
              
              {/* Filters - Desktop and Mobile Expanded */}
              <div className={`${
                showFilters ? "block" : "hidden md:block"
              } w-full md:w-64 lg:w-80 bg-white p-6 rounded-lg mb-6 md:mb-0 shadow-sm`}>
                <h3 className="text-xl font-medium mb-4">Filters</h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {["$0 - $500", "$500 - $1000", "$1000 - $2000", "$2000+"].map(range => (
                      <label key={range} className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="price" 
                          className="w-4 h-4 text-furniture-accent border-gray-300 focus:ring-furniture-accent"
                          onChange={() => setActiveFilter(range)}
                          checked={activeFilter === range}
                        />
                        <span className="ml-2">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Material */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Material</h4>
                  <div className="space-y-2">
                    {["Wood", "Metal", "Glass", "Leather", "Fabric"].map(material => (
                      <label key={material} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-furniture-accent border-gray-300 rounded focus:ring-furniture-accent"
                        />
                        <span className="ml-2">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Color */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Natural", color: "#D2B48C" },
                      { name: "White", color: "#FFFFFF" },
                      { name: "Black", color: "#000000" },
                      { name: "Gray", color: "#808080" },
                      { name: "Blue", color: "#4A90E2" },
                      { name: "Green", color: "#50C878" }
                    ].map(color => (
                      <button
                        key={color.name}
                        className="w-8 h-8 rounded-full border border-gray-300 relative"
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      >
                        {activeFilter === color.name && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check size={16} className={color.name === "White" ? "text-black" : "text-white"} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Style */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Style</h4>
                  <div className="space-y-2">
                    {["Modern", "Traditional", "Contemporary", "Industrial", "Scandinavian"].map(style => (
                      <label key={style} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-furniture-accent border-gray-300 rounded focus:ring-furniture-accent"
                        />
                        <span className="ml-2">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-furniture-dark text-white rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors w-1/2">
                    Apply
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors w-1/2">
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Products */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-playfair font-semibold">
                    {activeSubcategory ? 
                      subcategories.find(s => s.slug === activeSubcategory)?.name : 
                      "All Products"}
                  </h2>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-furniture-accent2">Sort by:</span>
                    <select className="border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-furniture-accent">
                      <option>Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest</option>
                      <option>Bestselling</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        opacity: 0,
                        animation: 'fade-up 0.7s ease-out forwards',
                      }}
                    >
                      {product.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`text-xs font-medium py-1 px-3 rounded ${
                            product.badge === "Bestseller" 
                              ? "bg-amber-500 text-white" 
                              : product.badge === "New" 
                              ? "bg-emerald-500 text-white" 
                              : product.badge === "Limited" 
                              ? "bg-rose-500 text-white"
                              : "bg-furniture-accent text-furniture-dark"
                          }`}>
                            {product.badge}
                          </span>
                        </div>
                      )}
                      
                      <Link to={`/product/${product.id}`} className="block">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      
                      <div className="p-4">
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="font-medium text-lg hover:text-furniture-accent transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center mt-2 mb-3">
                          <span className="font-medium text-lg">AED {product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              AED {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <button className="w-full py-2 bg-furniture-dark text-white flex items-center justify-center rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredProducts.length > 9 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-1">
                      <button className="w-10 h-10 rounded-full border border-furniture-muted flex items-center justify-center">
                        <ChevronLeft size={16} />
                      </button>
                      {[1, 2, 3, 4, 5].map(page => (
                        <button 
                          key={page}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            page === 1 
                              ? "bg-furniture-accent text-furniture-dark" 
                              : "border border-furniture-muted hover:bg-furniture-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button className="w-10 h-10 rounded-full border border-furniture-muted flex items-center justify-center">
                        <ChevronRight size={16} />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Custom Furniture Section */}
        <section className="py-16 bg-furniture-dark relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
            <img 
              src={customSectionImage} 
              alt="Custom furniture craftsmanship" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-furniture-dark via-furniture-dark/95 to-transparent"></div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-2xl animate-fade-up">
              <h2 className="text-3xl md:text-4xl text-white font-playfair font-semibold mb-4">
                {customSectionTitle}
              </h2>
              <p className="text-white/80 text-lg mb-8">
                {customSectionDescription}
              </p>
              <Link
                to={`/custom-furniture?category=${categorySlug}`}
                className="inline-block px-8 py-3.5 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/90 hover:shadow-lg"
              >
                Start Your Custom Order
              </Link>
            </div>
          </div>
        </section>
        
        {/* Reviews Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-playfair font-semibold mb-10 text-center">
              Customer Reviews
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, index) => (
                <div
                  key={review.id}
                  className="bg-furniture-light rounded-lg p-6 shadow-sm"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    opacity: 0,
                    animation: 'fade-up 0.7s ease-out forwards',
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? "text-furniture-accent" : "text-furniture-muted"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-furniture-accent2">
                      {review.rating}.0
                    </span>
                  </div>
                  
                  <p className="italic text-furniture-dark mb-4">"{review.text}"</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{review.name}</h4>
                      <p className="text-xs text-furniture-accent2">{review.date}</p>
                    </div>
                    <span className="text-xs bg-furniture-muted px-2 py-1 rounded">
                      {review.productName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/reviews"
                className="inline-flex items-center px-6 py-3 bg-furniture-light text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-muted"
              >
                View All Reviews <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Blog Section */}
        <section className="py-16 bg-furniture-light">
          <div className="container-custom">
            <h2 className="text-3xl font-playfair font-semibold mb-10 text-center">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} delay={index * 150} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 bg-white text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-muted"
              >
                View All Articles <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
