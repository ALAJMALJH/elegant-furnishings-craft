
import React from 'react';
import CategoryPage from '../components/Category/CategoryPage';

const livingRoomSubcategories = [
  {
    id: "sofas",
    name: "Sofas & Sectionals",
    image: "https://images.unsplash.com/photo-1540730930991-a9286a5f5450",
    slug: "sofas-sectionals"
  },
  {
    id: "coffee-tables",
    name: "Coffee Tables",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd",
    slug: "coffee-tables"
  },
  {
    id: "tv-stands",
    name: "TV Stands & Media Units",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f",
    slug: "tv-stands"
  },
  {
    id: "accent-chairs",
    name: "Accent Chairs",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    slug: "accent-chairs"
  },
  {
    id: "bookshelves",
    name: "Bookshelves & Display",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    slug: "bookshelves"
  }
];

const livingRoomProducts = [
  {
    id: "lr-sofa-1",
    name: "Valencia 3-Seater Sofa",
    price: 5999,
    originalPrice: 7999,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    category: "living-room",
    subcategory: "sofas-sectionals",
    badge: "Bestseller"
  },
  {
    id: "lr-sofa-2",
    name: "Monaco L-Shaped Sectional",
    price: 8499,
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea",
    category: "living-room",
    subcategory: "sofas-sectionals",
    badge: "New"
  },
  {
    id: "lr-coffee-1",
    name: "Marble Top Coffee Table",
    price: 2699,
    image: "https://images.unsplash.com/photo-1531973486364-5fa64260d75b",
    category: "living-room",
    subcategory: "coffee-tables"
  },
  {
    id: "lr-coffee-2",
    name: "Walnut Wood Coffee Table",
    price: 1899,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    category: "living-room",
    subcategory: "coffee-tables"
  },
  {
    id: "lr-tv-1",
    name: "Modern TV Console",
    price: 3199,
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265",
    category: "living-room",
    subcategory: "tv-stands"
  },
  {
    id: "lr-chair-1",
    name: "Velvet Accent Chair",
    price: 1799,
    image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467",
    category: "living-room",
    subcategory: "accent-chairs",
    badge: "Limited"
  },
  {
    id: "lr-chair-2",
    name: "Leather Lounge Chair",
    price: 2499,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "living-room",
    subcategory: "accent-chairs"
  },
  {
    id: "lr-shelf-1",
    name: "Modern Bookcase",
    price: 2899,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
    category: "living-room",
    subcategory: "bookshelves"
  },
  {
    id: "lr-shelf-2",
    name: "Display Cabinet",
    price: 4299,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    category: "living-room",
    subcategory: "bookshelves"
  }
];

const livingRoomReviews = [
  {
    id: 1,
    name: "Sarah Thompson",
    date: "August 15, 2023",
    rating: 5,
    text: "The Valencia sofa is absolutely stunning and extremely comfortable. It's completely transformed our living space.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    productName: "Valencia Sofa"
  },
  {
    id: 2,
    name: "Ahmed Al Marzouqi",
    date: "July 22, 2023",
    rating: 5,
    text: "After months of searching, I finally found the perfect coffee table. The marble top is exquisite and the quality is exceptional.",
    image: "https://images.unsplash.com/photo-1531973486364-5fa64260d75b",
    productName: "Marble Coffee Table"
  },
  {
    id: 3,
    name: "Emily Chen",
    date: "September 3, 2023",
    rating: 4,
    text: "The accent chair looks beautiful in our living room. The only reason for 4 stars is that it took longer than expected to deliver.",
    image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467",
    productName: "Velvet Accent Chair"
  }
];

const livingRoomBlogPosts = [
  {
    id: "1",
    title: "5 Ways to Style Your Coffee Table",
    excerpt: "Learn how to create a stunning coffee table display that reflects your personal style.",
    image: "https://images.unsplash.com/photo-1588703195542-ccf2c39f2522",
    date: "August 25, 2023",
    author: "Leila Ahmed",
    category: "Styling Tips"
  },
  {
    id: "2",
    title: "Small Living Room? Big Ideas!",
    excerpt: "Maximize your space with these clever furniture arrangements and storage solutions.",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    date: "July 18, 2023",
    author: "Michael Rodriguez",
    category: "Space Planning"
  },
  {
    id: "3",
    title: "How to Care for Leather Furniture",
    excerpt: "Keep your leather sofas and chairs looking beautiful for years with these maintenance tips.",
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea",
    date: "September 5, 2023",
    author: "James Wilson",
    category: "Furniture Care"
  }
];

const CategoryLivingRoom = () => {
  return (
    <CategoryPage
      categorySlug="living-room"
      hero={{
        title: "Living Room Furniture",
        subtitle: "Create a space that reflects your style with our elegant living room collection",
        image: "https://images.unsplash.com/photo-1618219878829-43f60d4f0851"
      }}
      subcategories={livingRoomSubcategories}
      featuredProducts={livingRoomProducts}
      reviews={livingRoomReviews}
      blogPosts={livingRoomBlogPosts}
      customSectionTitle="Your Dream Living Room, Custom Designed"
      customSectionDescription="From bespoke sofas to custom entertainment units, our master craftsmen will create living room furniture tailored to your exact specifications, style preferences, and space requirements."
      customSectionImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
    />
  );
};

export default CategoryLivingRoom;
