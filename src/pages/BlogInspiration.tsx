import React, { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import BlogCard from "../components/Category/BlogCard";
import { Search, Filter, ChevronRight, Tag, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

// Sample blog post data
const blogPosts = [
  {
    id: "1",
    title: "Top 5 Sofa Designs for Modern Homes",
    excerpt:
      "Discover the most stylish and comfortable sofa designs that will transform your living space into a modern haven.",
    image: "https://images.unsplash.com/photo-1549187774-b4b5244aedb4",
    date: "June 10, 2023",
    author: "Sarah Williams",
    category: "Design Tips",
    content: "Full article content here...",
  },
  {
    id: "2",
    title: "How to Maintain Wooden Furniture",
    excerpt:
      "Learn the essential care tips and techniques to keep your wooden furniture looking beautiful for generations.",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd",
    date: "May 25, 2023",
    author: "Ahmed Khan",
    category: "Furniture Care",
    content: "Full article content here...",
  },
  {
    id: "3",
    title: "Latest Furniture Trends in 2023",
    excerpt:
      "Stay ahead of the curve with our guide to the hottest furniture trends that are dominating interior design this year.",
    image: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77",
    date: "April 18, 2023",
    author: "Emily Parker",
    category: "Trends",
    content: "Full article content here...",
  },
  {
    id: "4",
    title: "Small Space Solutions: Furniture for Apartments",
    excerpt:
      "Maximize your small living space with these clever furniture choices and arrangement tips.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    date: "March 15, 2023",
    author: "David Chen",
    category: "Space Optimization",
    content: "Full article content here...",
  },
  {
    id: "5",
    title: "The Art of Mixing Modern and Vintage Furniture",
    excerpt:
      "Create a unique interior by combining contemporary pieces with vintage finds for a space full of character.",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126",
    date: "February 28, 2023",
    author: "Sophia Rodriguez",
    category: "Interior Design",
    content: "Full article content here...",
  },
  {
    id: "6",
    title: "Creating the Perfect Home Office Setup",
    excerpt:
      "Design a productive and comfortable workspace with the right furniture and accessories.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd",
    date: "January 20, 2023",
    author: "Michael Johnson",
    category: "Office Design",
    content: "Full article content here...",
  },
  {
    id: "7",
    title: "Sustainable Furniture: Eco-Friendly Choices for Your Home",
    excerpt:
      "Make environmentally conscious decisions with our guide to sustainable furniture materials and brands.",
    image: "https://images.unsplash.com/photo-1473893604213-3df9c15611c0",
    date: "December 12, 2022",
    author: "Aisha Ali",
    category: "Sustainability",
    content: "Full article content here...",
  },
  {
    id: "8",
    title: "Color Psychology in Furniture Selection",
    excerpt:
      "Understand how different colors affect mood and how to use this knowledge when choosing furniture.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    date: "November 5, 2022",
    author: "James Wilson",
    category: "Design Tips",
    content: "Full article content here...",
  },
  {
    id: "9",
    title: "Customer Story: A Complete Home Transformation",
    excerpt:
      "See how the Ahmadi family transformed their home with custom Al Ajmal furniture pieces.",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
    date: "October 18, 2022",
    author: "Fatima Hassan",
    category: "Customer Stories",
    content: "Full article content here...",
  },
];

// Extract unique categories
const categories = [...new Set(blogPosts.map(post => post.category))];

const BlogInspiration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Banner */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
              alt="Interior Design Inspiration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
          </div>
          <div className="container-custom relative h-full flex flex-col justify-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-4 animate-fade-up">
              Blog & Inspiration
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white/90 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Ideas, advice, and inspiration for your home
            </p>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 bg-furniture-light">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Main Content */}
              <div className="lg:w-2/3">
                {/* Search and Filter - Mobile */}
                <div className="mb-8 lg:hidden">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search articles..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full p-3 pr-10 border border-furniture-muted rounded-md focus:outline-none focus:ring-1 focus:ring-furniture-accent"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-furniture-accent2" size={18} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Filter by Category</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={`px-3 py-1.5 rounded-md text-sm ${
                            selectedCategory === null
                              ? "bg-furniture-accent text-furniture-dark"
                              : "bg-furniture-muted text-furniture-dark"
                          }`}
                          onClick={() => setSelectedCategory(null)}
                        >
                          All
                        </button>
                        {categories.map(category => (
                          <button
                            key={category}
                            className={`px-3 py-1.5 rounded-md text-sm ${
                              selectedCategory === category
                                ? "bg-furniture-accent text-furniture-dark"
                                : "bg-furniture-muted text-furniture-dark"
                            }`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Featured Article */}
                <div className="mb-12">
                  <h2 className="text-2xl font-playfair font-semibold mb-6">Featured Article</h2>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover-scale custom-shadow animate-fade-up">
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-furniture-accent text-furniture-dark px-3 py-1 rounded-md text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-xs font-medium py-1 px-2.5 bg-furniture-accent/20 text-furniture-accent2 rounded">
                          {blogPosts[0].category}
                        </span>
                      </div>
                      <Link to={`/blog/${blogPosts[0].id}`}>
                        <h3 className="text-2xl font-playfair font-semibold mb-3 hover:text-furniture-accent transition-colors">
                          {blogPosts[0].title}
                        </h3>
                      </Link>
                      <p className="text-furniture-accent2 mb-6">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-furniture-muted">
                        <div className="flex items-center text-sm text-furniture-accent2">
                          <Calendar size={14} className="mr-1" />
                          {blogPosts[0].date}
                        </div>
                        <Link
                          to={`/blog/${blogPosts[0].id}`}
                          className="text-furniture-dark font-medium hover:text-furniture-accent transition-colors flex items-center"
                        >
                          Read More <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* All Articles */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-playfair font-semibold">All Articles</h2>
                    <div className="text-sm text-furniture-accent2">
                      {filteredPosts.length} {filteredPosts.length === 1 ? "Article" : "Articles"}
                    </div>
                  </div>
                  
                  {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredPosts.map((post, index) => (
                        <BlogCard key={post.id} post={post} delay={index * 100} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-lg text-center">
                      <p className="text-lg text-furniture-accent2">No articles match your search criteria.</p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory(null);
                        }}
                        className="mt-4 px-4 py-2 bg-furniture-accent text-furniture-dark rounded-md"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                {/* Search and Categories - Desktop */}
                <div className="hidden lg:block sticky top-24">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-playfair font-semibold mb-6">Search</h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 pr-10 border border-furniture-muted rounded-md focus:outline-none focus:ring-1 focus:ring-furniture-accent"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-furniture-accent2" size={18} />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-playfair font-semibold mb-6">Categories</h2>
                    <div className="space-y-3">
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                          selectedCategory === null
                            ? "bg-furniture-accent text-furniture-dark"
                            : "hover:bg-furniture-muted"
                        }`}
                        onClick={() => setSelectedCategory(null)}
                      >
                        <span>All Categories</span>
                        <ChevronRight size={16} />
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                            selectedCategory === category
                              ? "bg-furniture-accent text-furniture-dark"
                              : "hover:bg-furniture-muted"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <span>{category}</span>
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-playfair font-semibold mb-6">Popular Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center px-3 py-1.5 bg-furniture-muted rounded-md text-sm hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                        <Tag size={14} className="mr-1" /> Interior Design
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-furniture-muted rounded-md text-sm hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                        <Tag size={14} className="mr-1" /> DIY
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-furniture-muted rounded-md text-sm hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                        <Tag size={14} className="mr-1" /> Small Spaces
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-furniture-muted rounded-md text-sm hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                        <Tag size={14} className="mr-1" /> Bedroom
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-furniture-muted rounded-md text-sm hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                        <Tag size={14} className="mr-1" /> Living Room
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-furniture-muted rounded-md text-sm hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                        <Tag size={14} className="mr-1" /> Storage
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-furniture-dark rounded-lg shadow-md p-6 text-white">
                    <h2 className="text-xl font-playfair font-semibold mb-4">Need Design Advice?</h2>
                    <p className="text-white/80 mb-6">
                      Our interior design experts are available to help you create the perfect space.
                    </p>
                    <Link
                      to="/contact"
                      className="w-full px-4 py-3 bg-furniture-accent text-furniture-dark font-medium rounded-md flex items-center justify-center"
                    >
                      Contact Us <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Stories Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">Customer Stories</h2>
              <p className="text-furniture-accent2 text-lg max-w-3xl mx-auto">
                Real transformations and experiences from Al Ajmal customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.filter(post => post.category === "Customer Stories").slice(0, 3).map((post, index) => (
                <div 
                  key={post.id} 
                  className="bg-furniture-light rounded-lg overflow-hidden hover-scale custom-shadow animate-fade-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-playfair font-semibold mb-3">{post.title}</h3>
                    <p className="text-furniture-accent2 text-sm mb-4">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-furniture-dark font-medium hover:text-furniture-accent transition-colors flex items-center"
                    >
                      Read Their Story <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="py-16 bg-furniture-light">
          <div className="container-custom">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">Video Guides & Tutorials</h2>
              <p className="text-furniture-accent2 text-lg max-w-3xl mx-auto">
                Watch our helpful furniture guides and styling tips
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg animate-fade-up">
                <img
                  src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
                  alt="Furniture Assembly Guide"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-furniture-accent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-medium text-white">How to Assemble Your Furniture</h3>
                  <p className="text-white/80 text-sm">Step-by-step guide for easy assembly</p>
                </div>
              </div>
              
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg animate-fade-up" style={{ animationDelay: "150ms" }}>
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
                  alt="Interior Styling Tips"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-furniture-accent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-medium text-white">5 Interior Styling Tips</h3>
                  <p className="text-white/80 text-sm">Transform your space with these professional tips</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-furniture-dark text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-playfair font-semibold mb-4">Get Inspiration Delivered</h2>
              <p className="text-white/80 mb-8">
                Subscribe to our newsletter to receive the latest blog posts, design tips, and exclusive offers.
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

export default BlogInspiration;

