
import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const OffersSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title">Exclusive Offers</h2>
          <p className="section-subtitle">Limited-time deals on premium furniture</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Offer Card 1 */}
          <div 
            className="rounded-lg overflow-hidden shadow-lg relative group hover-scale"
            style={{ 
              opacity: 0,
              animation: 'fade-up 0.7s ease-out forwards',
            }}
          >
            <div className="h-96 relative">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
                alt="Sofa Offer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="bg-furniture-accent/90 text-furniture-dark font-semibold px-4 py-1.5 rounded inline-block mb-3">
                  Limited Time
                </div>
                <h3 className="text-3xl font-playfair font-semibold text-white mb-2">
                  20% Off All Sofas
                </h3>
                <p className="text-white/90 mb-4">
                  Elevate your living room with our premium sofa collection
                </p>
                
                <div className="flex items-center text-white mb-4">
                  <Clock size={18} className="mr-2" />
                  <div className="flex space-x-3">
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="block text-xl font-semibold">14</span>
                      <span className="text-xs">Days</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="block text-xl font-semibold">06</span>
                      <span className="text-xs">Hours</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="block text-xl font-semibold">22</span>
                      <span className="text-xs">Mins</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/offers/sofas"
                  className="inline-block px-6 py-2.5 bg-white text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Offer Card 2 */}
          <div 
            className="rounded-lg overflow-hidden shadow-lg relative group hover-scale"
            style={{ 
              opacity: 0,
              animation: 'fade-up 0.7s ease-out forwards',
              animationDelay: '150ms',
            }}
          >
            <div className="h-96 relative">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                alt="Bedroom Set Offer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="bg-furniture-accent/90 text-furniture-dark font-semibold px-4 py-1.5 rounded inline-block mb-3">
                  Bundle Deal
                </div>
                <h3 className="text-3xl font-playfair font-semibold text-white mb-2">
                  Buy Bed, Get Nightstand Free
                </h3>
                <p className="text-white/90 mb-4">
                  Complete your bedroom with this special bundle offer
                </p>
                
                <div className="flex items-center text-white mb-4">
                  <Clock size={18} className="mr-2" />
                  <div className="flex space-x-3">
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="block text-xl font-semibold">07</span>
                      <span className="text-xs">Days</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="block text-xl font-semibold">12</span>
                      <span className="text-xs">Hours</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
                      <span className="block text-xl font-semibold">45</span>
                      <span className="text-xs">Mins</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/offers/bedroom"
                  className="inline-block px-6 py-2.5 bg-white text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          
          {/* Banner Offers */}
          <div 
            className="lg:col-span-2 rounded-lg bg-furniture-accent/10 p-8 md:p-10 border border-furniture-accent/20 mt-4"
            style={{ 
              opacity: 0,
              animation: 'fade-up 0.7s ease-out forwards',
              animationDelay: '300ms',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-furniture-dark mb-2">
                  New Customer Special
                </h3>
                <p className="text-furniture-accent2 mb-6 md:mb-0">
                  Use code <span className="font-semibold">WELCOME15</span> for 15% off your first order
                </p>
              </div>
              <Link
                to="/signup"
                className="px-8 py-3 bg-furniture-dark text-white font-medium rounded transition-all duration-300 hover:bg-furniture-accent hover:text-furniture-dark"
              >
                Sign Up & Save
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
