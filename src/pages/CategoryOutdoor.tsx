
import React from 'react';
import CategoryPage from '../components/Category/CategoryPage';

const outdoorSubcategories = [
  {
    id: "patio-sets",
    name: "Patio Tables & Chairs",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    slug: "patio-sets"
  },
  {
    id: "outdoor-sofas",
    name: "Outdoor Sofas & Loungers",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    slug: "outdoor-sofas"
  },
  {
    id: "swings",
    name: "Swing Chairs & Hammocks",
    image: "https://images.unsplash.com/photo-1540991825428-5b54b09f7338",
    slug: "swings"
  },
  {
    id: "fire-pits",
    name: "Fire Pits & Heaters",
    image: "https://images.unsplash.com/photo-1593204475608-433e8f02a534",
    slug: "fire-pits"
  },
  {
    id: "storage",
    name: "Garden Storage & Decor",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    slug: "storage"
  }
];

const outdoorProducts = [
  {
    id: "out-dining-1",
    name: "6-Seater Patio Dining Set",
    price: 8999,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    category: "outdoor",
    subcategory: "patio-sets",
    badge: "Bestseller"
  },
  {
    id: "out-dining-2",
    name: "4-Seater Round Patio Table",
    price: 4999,
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    category: "outdoor",
    subcategory: "patio-sets",
    badge: "New"
  },
  {
    id: "out-sofa-1",
    name: "Outdoor Sectional Sofa",
    price: 7699,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    category: "outdoor",
    subcategory: "outdoor-sofas"
  },
  {
    id: "out-lounger-1",
    name: "Poolside Lounger (Set of 2)",
    price: 3899,
    originalPrice: 4499,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    category: "outdoor",
    subcategory: "outdoor-sofas"
  },
  {
    id: "out-swing-1",
    name: "Hanging Egg Chair",
    price: 3199,
    image: "https://images.unsplash.com/photo-1540991825428-5b54b09f7338",
    category: "outdoor",
    subcategory: "swings"
  },
  {
    id: "out-hammock-1",
    name: "Luxury Garden Hammock",
    price: 2799,
    image: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e",
    category: "outdoor",
    subcategory: "swings",
    badge: "Limited"
  },
  {
    id: "out-fire-1",
    name: "Modern Fire Pit",
    price: 4499,
    image: "https://images.unsplash.com/photo-1593204475608-433e8f02a534",
    category: "outdoor",
    subcategory: "fire-pits"
  },
  {
    id: "out-storage-1",
    name: "Outdoor Storage Box",
    price: 1999,
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    category: "outdoor",
    subcategory: "storage"
  },
  {
    id: "out-decor-1",
    name: "Garden Planter Set",
    price: 1299,
    image: "https://images.unsplash.com/photo-1599598177991-ec67b5c37318",
    category: "outdoor",
    subcategory: "storage"
  }
];

const outdoorReviews = [
  {
    id: 1,
    name: "Richard Taylor",
    date: "August 12, 2023",
    rating: 5,
    text: "The patio dining set has transformed our outdoor space. It's not only beautiful but extremely durable in the UAE heat and humidity.",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    productName: "Patio Dining Set"
  },
  {
    id: 2,
    name: "Noor Al Suwaidi",
    date: "July 28, 2023",
    rating: 5,
    text: "We couldn't be happier with our outdoor sectional. It's comfortable, stylish, and has withstood a full summer of pool parties and family gatherings.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    productName: "Outdoor Sectional"
  },
  {
    id: 3,
    name: "Jennifer Lopez",
    date: "September 8, 2023",
    rating: 4,
    text: "The hanging egg chair is a beautiful addition to our garden. It's so comfortable and has become everyone's favorite spot. Assembly was a bit tricky though.",
    image: "https://images.unsplash.com/photo-1540991825428-5b54b09f7338",
    productName: "Hanging Egg Chair"
  }
];

const outdoorBlogPosts = [
  {
    id: "1",
    title: "Creating an Outdoor Oasis in the UAE",
    excerpt: "Design tips for beautiful outdoor spaces that can withstand the Gulf climate.",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    date: "August 25, 2023",
    author: "Amina Khalid",
    category: "Landscape Design"
  },
  {
    id: "2",
    title: "Outdoor Furniture Care: Desert Edition",
    excerpt: "How to maintain and protect your outdoor furniture from sun, sand, and humidity.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    date: "July 20, 2023",
    author: "John Williams",
    category: "Maintenance"
  },
  {
    id: "3",
    title: "Al Fresco Dining: Setting the Perfect Outdoor Table",
    excerpt: "Create memorable outdoor dining experiences with these styling and serving tips.",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    date: "September 15, 2023",
    author: "Fatima Al Hashemi",
    category: "Entertaining"
  }
];

const CategoryOutdoor = () => {
  return (
    <CategoryPage
      categorySlug="outdoor"
      hero={{
        title: "Outdoor Furniture",
        subtitle: "Create your perfect outdoor retreat with our premium collection",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea"
      }}
      subcategories={outdoorSubcategories}
      featuredProducts={outdoorProducts}
      reviews={outdoorReviews}
      blogPosts={outdoorBlogPosts}
      customSectionTitle="Custom Outdoor Furniture for Your Unique Space"
      customSectionDescription="From bespoke patio sets designed to fit your exact measurements to custom outdoor kitchens and entertainment areas, our craftsmen can create beautiful, durable outdoor furniture tailored to your lifestyle."
      customSectionImage="https://images.unsplash.com/photo-1600585152220-90363fe7e115"
    />
  );
};

export default CategoryOutdoor;
