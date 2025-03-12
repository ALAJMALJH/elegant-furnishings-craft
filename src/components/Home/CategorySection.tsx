
import React, { useState, useEffect } from "react";
import CategoryCard from "../UI/CategoryCard";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

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
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // Get unique categories from products
      const { data: productCategories, error } = await supabase
        .from('products')
        .select('category, image_url')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching product categories:", error);
        return;
      }

      if (!productCategories || productCategories.length === 0) {
        // Use default categories if no products found
        setCategories(defaultCategories);
        return;
      }

      // Create unique category map
      const uniqueCategories = new Map<string, { image: string }>();
      
      productCategories.forEach(product => {
        if (product.category && !uniqueCategories.has(product.category)) {
          uniqueCategories.set(product.category, { 
            image: product.image_url
          });
        }
      });

      // Generate category description based on category name
      const formattedCategories = Array.from(uniqueCategories).map(([categoryName, data]) => {
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
      
      if (customFurnitureCategory && !formattedCategories.some(cat => cat.id === "custom")) {
        formattedCategories.push(customFurnitureCategory);
      }

      setCategories(formattedCategories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      // Fall back to default categories
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Set up realtime subscription for products table
  useRealtimeSubscription(
    [{ table: 'products', event: '*' }],
    {
      products: () => {
        console.log('Products updated, refreshing categories...');
        fetchCategories();
      }
    },
    false // Disable toast notifications
  );

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
            {categories.map((category, index) => (
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
