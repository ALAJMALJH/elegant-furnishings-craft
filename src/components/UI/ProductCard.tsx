
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";

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
  id,
  name,
  price,
  image,
  category,
  badge,
  originalPrice,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden custom-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: 0,
        animation: 'fade-up 0.7s ease-out forwards',
      }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-xs font-medium py-1 px-3 rounded ${
            badge === "Bestseller" 
              ? "bg-amber-500 text-white" 
              : badge === "New" 
              ? "bg-emerald-500 text-white" 
              : badge === "Limited" 
              ? "bg-rose-500 text-white"
              : "bg-furniture-accent text-furniture-dark"
          }`}>
            {badge}
          </span>
        </div>
      )}
      
      {/* Image */}
      <Link to={`/product/${id}`} className="block image-hover-zoom">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500"
        />
      </Link>
      
      {/* Quick Actions */}
      <div className={`absolute right-4 top-4 flex flex-col space-y-2 transition-all duration-300 ${
        isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}>
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-furniture-accent transition-colors">
          <Heart size={18} className="text-furniture-dark" />
        </button>
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-furniture-accent transition-colors">
          <Eye size={18} className="text-furniture-dark" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <span className="text-xs text-furniture-accent2 uppercase tracking-wider">{category}</span>
        <Link to={`/product/${id}`}>
          <h3 className="mt-1 font-playfair text-lg font-medium hover:text-furniture-accent transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-2">
          <span className="font-medium text-lg">AED {price.toLocaleString()}</span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              AED {originalPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-auto text-xs bg-furniture-muted text-furniture-accent2 px-2 py-0.5 rounded">
              Save {discount}%
            </span>
          )}
        </div>
        
        <button className="mt-4 w-full py-2.5 bg-furniture-dark text-white flex items-center justify-center rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors duration-300">
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
