
import React from "react";
import { ShoppingBag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BestsellerSection = () => {
  return (
    <section className="py-20 bg-furniture-light">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="section-title">Bestsellers & Trending</h2>
          <p className="section-subtitle">Our products are currently unavailable</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-sm text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
          <h3 className="text-xl font-medium mb-4">Product Catalog Temporarily Unavailable</h3>
          <p className="text-gray-500 mb-6">
            We are currently updating our product inventory and shopping experience. 
            All products are temporarily unavailable as we make these improvements.
          </p>
          <p className="text-gray-500 mb-6">
            Please check back soon or contact us directly for any inquiries about our furniture.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact">
              <Button variant="outline">
                Contact Us
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Our Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestsellerSection;
