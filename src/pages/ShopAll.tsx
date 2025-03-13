
import React from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { ChevronRight, Sofa, Bed, Table, LampDesk, TreeDeciduous, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ShopAll = () => {
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
              {[
                { name: "Living Room", path: "/category/living-room", icon: Sofa },
                { name: "Bedroom", path: "/category/bedroom", icon: Bed },
                { name: "Dining", path: "/category/dining", icon: Table },
                { name: "Office", path: "/category/office", icon: LampDesk },
                { name: "Outdoor", path: "/category/outdoor", icon: TreeDeciduous },
              ].map((category, index) => {
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

        {/* Products Unavailable Section */}
        <section className="py-16 bg-furniture-light">
          <div className="container-custom">
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-playfair">Products Currently Unavailable</CardTitle>
                <CardDescription>
                  We're currently updating our product catalog. Please check back later.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <ShoppingBag size={64} className="text-gray-400 mb-6" />
                <p className="text-center text-muted-foreground mb-6 max-w-lg">
                  We're working on improving our shopping experience and product offerings. 
                  Our products are temporarily unavailable as we make these updates.
                </p>
                <Link 
                  to="/contact" 
                  className="px-6 py-3 bg-furniture-accent text-furniture-dark font-medium rounded-md"
                >
                  Contact Us for Inquiries
                </Link>
              </CardContent>
            </Card>
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
