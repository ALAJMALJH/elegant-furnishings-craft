
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  description: string;
  link: string;
  delay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  description,
  link,
  delay = 0,
}) => {
  return (
    <div 
      className="group hover-scale custom-shadow rounded-lg overflow-hidden bg-white"
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: 0,
        animation: 'fade-up 0.8s ease-out forwards',
      }}
    >
      <Link to={link} className="block">
        <div className="image-hover-zoom h-64 md:h-72 relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-playfair font-semibold mb-2">{title}</h3>
          <p className="text-furniture-accent2 text-sm mb-4">{description}</p>
          <div
            className="inline-flex items-center text-furniture-dark font-medium hover:text-furniture-accent transition-colors"
          >
            Explore Collection <ChevronRight size={16} className="ml-1 mt-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
