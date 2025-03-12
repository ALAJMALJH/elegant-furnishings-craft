
import React from "react";
import CategoryCard from "../UI/CategoryCard";
import { useProductSync } from "@/contexts/ProductSyncContext";

// Default categories in case there are no products
const defaultCategories = [
  {
    id: "living-room",
    title: "Living Room",
    image: "https://images.unsplash.com/photo-1633505899118-4ca6bd143043",
    description: "Elegant sofas, coffee tables, and accent pieces",
    link: "/category/living-room",
  },
  {
    id: "bedroom",
    title: "Bedroom",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64b2a",
    description: "Luxurious beds, wardrobes, and nightstands",
    link: "/category/bedroom",
  },
  {
    id: "dining",
    title: "Dining Room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200",
    description: "Stunning dining tables, chairs, and buffets",
    link: "/category/dining",
  },
  {
    id: "office",
    title: "Office",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
    description: "Productive desks, chairs, and storage solutions",
    link: "/category/office",
  },
  {
    id: "outdoor",
    title: "Outdoor",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    description: "Durable and stylish patio and garden furniture",
    link: "/category/outdoor",
  },
  {
    id: "custom",
    title: "Custom Furniture",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd",
    description: "Personalized designs crafted to your specifications",
    link: "/custom-furniture",
  },
];

interface Category {
  id: string;
  title: string;
  image: string;
  description: string;
  link: string;
}

const CategorySection = () => {
  const { categories, isLoading } = useProductSync();

  // Generate categories from ProductSyncContext data
  const generatedCategories: Category[] = Array.from(categories.entries()).map(([categoryName, data]) => {
    // Format the category title (e.g., "living-room" -> "Living Room")
    const title = categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Format the description based on the category
    let description = "";
    if (categoryName === "living-room") {
      description = "Elegant sofas, coffee tables, and accent pieces";
    } else if (categoryName === "bedroom") {
      description = "Luxurious beds, wardrobes, and nightstands";
    } else if (categoryName === "dining") {
      description = "Stunning dining tables, chairs, and buffets";
    } else if (categoryName === "office") {
      description = "Productive desks, chairs, and storage solutions";
    } else if (categoryName === "outdoor") {
      description = "Durable and stylish patio and garden furniture";
    } else {
      description = `Beautiful ${title.toLowerCase()} furniture for your home`;
    }

    return {
      id: categoryName,
      title,
      image: data.image || `https://images.unsplash.com/photo-1555041469-a586c61ea9bc`,
      description,
      link: `/category/${categoryName}`,
    };
  });

  // Always include custom furniture
  const customFurnitureCategory = defaultCategories.find(cat => cat.id === "custom");
  
  if (customFurnitureCategory && !generatedCategories.some(cat => cat.id === "custom")) {
    generatedCategories.push(customFurnitureCategory);
  }

  // Use generated categories or fall back to defaults if none are available
  const displayCategories = generatedCategories.length > 0 ? generatedCategories : defaultCategories;

  return (
    <section className="py-20 bg-furniture-light">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Discover our exquisite collections</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-100 animate-pulse h-64 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                image={category.image}
                description={category.description}
                link={category.link}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
