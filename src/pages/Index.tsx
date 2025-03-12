import React, { useEffect } from "react";
import { ProductSyncProvider } from "@/contexts/ProductSyncContext";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import HeroSection from "../components/Home/HeroSection";
import CategorySection from "../components/Home/CategorySection";
import BestsellerSection from "../components/Home/BestsellerSection";
import CustomFurnitureSection from "../components/Home/CustomFurnitureSection";
import ReviewSection from "../components/Home/ReviewSection";
import OffersSection from "../components/Home/OffersSection";
import BlogSection from "../components/Home/BlogSection";
import InstagramSection from "../components/Home/InstagramSection";
import { ChevronUp } from "lucide-react";

const Index = () => {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ProductSyncProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main>
          <HeroSection />
          <CategorySection />
          <BestsellerSection />
          <CustomFurnitureSection />
          <ReviewSection />
          <OffersSection />
          <BlogSection />
          <InstagramSection />
        </main>
        
        <Footer />
        
        {/* Scroll to top button */}
        <button
          onClick={handleScrollToTop}
          className={`fixed right-6 bottom-6 w-12 h-12 rounded-full bg-furniture-accent flex items-center justify-center shadow-lg transition-all duration-300 z-40 ${
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} className="text-furniture-dark" />
        </button>
      </div>
    </ProductSyncProvider>
  );
};

export default Index;
