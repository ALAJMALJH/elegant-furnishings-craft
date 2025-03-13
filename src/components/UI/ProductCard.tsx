
import React from "react";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  originalPrice?: number;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  category,
  badge,
  delay = 0,
}) => {
  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden custom-shadow"
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: 0,
        animation: 'fade-up 0.7s ease-out forwards',
      }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-xs font-medium py-1 px-3 rounded bg-gray-500 text-white`}>
            {badge}
          </span>
        </div>
      )}
      
      {/* Image */}
      <div className="block image-hover-zoom">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white/80 px-4 py-2 rounded text-furniture-dark font-medium">
            Currently Unavailable
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <span className="text-xs text-furniture-accent2 uppercase tracking-wider">{category}</span>
        <h3 className="mt-1 font-playfair text-lg font-medium text-gray-500">
          {name}
        </h3>
        
        <div className="flex items-center mt-2">
          <span className="font-medium text-lg text-gray-400">Currently Unavailable</span>
        </div>
        
        <button 
          disabled
          className="mt-4 w-full py-2.5 bg-gray-300 text-gray-600 flex items-center justify-center rounded cursor-not-allowed"
        >
          <ShoppingBag size={18} className="mr-2" />
          Unavailable
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
