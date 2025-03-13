
import React from 'react';
import CategoryPage from '../components/Category/CategoryPage';

const bedroomSubcategories = [
  {
    id: "beds",
    name: "Beds",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64b2a",
    slug: "beds"
  },
  {
    id: "nightstands",
    name: "Nightstands & Side Tables",
    image: "https://images.unsplash.com/photo-1591079381491-cb2c15f58261",
    slug: "nightstands"
  },
  {
    id: "wardrobes",
    name: "Wardrobes & Dressers",
    image: "https://images.unsplash.com/photo-1610099917789-a87f5c2ba057",
    slug: "wardrobes"
  },
  {
    id: "vanity",
    name: "Vanity Tables",
    image: "https://images.unsplash.com/photo-1576188973526-0e5765ef35d9",
    slug: "vanity"
  },
  {
    id: "benches",
    name: "Benches & Ottomans",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    slug: "benches"
  }
];

const bedroomReviews = [
  {
    id: 1,
    name: "Michael Williams",
    date: "August 10, 2023",
    rating: 5,
    text: "The king bed frame is absolutely beautiful and exceptionally well-made. It completely transformed our bedroom.",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
    productName: "Luxury King Bed"
  },
  {
    id: 2,
    name: "Fatima Al Zaabi",
    date: "July 15, 2023",
    rating: 5,
    text: "The nightstand is perfect - elegant design and excellent quality. Delivery was prompt and assembly was very easy.",
    image: "https://images.unsplash.com/photo-1591079381491-cb2c15f58261",
    productName: "Marble Nightstand"
  },
  {
    id: 3,
    name: "Robert Chen",
    date: "September 2, 2023",
    rating: 4,
    text: "The wardrobe is spacious and looks fantastic in our bedroom. Would have given 5 stars if it had LED lighting inside.",
    image: "https://images.unsplash.com/photo-1610099917789-a87f5c2ba057",
    productName: "3-Door Wardrobe"
  }
];

const bedroomBlogPosts = [
  {
    id: "1",
    title: "Create a Peaceful Bedroom Retreat",
    excerpt: "Transform your bedroom into a calming sanctuary with these design tips and furniture choices.",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64b2a",
    date: "August 20, 2023",
    author: "Sophia Garcia",
    category: "Interior Design"
  },
  {
    id: "2",
    title: "Maximize Storage in Small Bedrooms",
    excerpt: "Clever storage solutions and space-saving furniture ideas for compact bedrooms.",
    image: "https://images.unsplash.com/photo-1610099917789-a87f5c2ba057",
    date: "July 12, 2023",
    author: "David Wilson",
    category: "Space Planning"
  },
  {
    id: "3",
    title: "The Perfect Bed for Quality Sleep",
    excerpt: "How to choose the right bed frame, mattress, and bedding for optimal comfort and rest.",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
    date: "September 8, 2023",
    author: "Nora Ahmed",
    category: "Sleep Health"
  }
];

const CategoryBedroom = () => {
  return (
    <CategoryPage
      categorySlug="bedroom"
      hero={{
        title: "Bedroom Furniture",
        subtitle: "Products currently unavailable - Please check back later",
        image: "https://images.unsplash.com/photo-1616593969747-4797dc75033e"
      }}
      subcategories={bedroomSubcategories}
      featuredProducts={[]} // Empty array for products
      reviews={bedroomReviews}
      blogPosts={bedroomBlogPosts}
      customSectionTitle="Your Dream Bedroom, Tailored to Perfection"
      customSectionDescription="From custom-sized bed frames to bespoke wardrobes designed for your space, our craftsmen will create bedroom furniture that perfectly fits your requirements and style preferences."
      customSectionImage="https://images.unsplash.com/photo-1505693314120-0d443867891c"
    />
  );
};

export default CategoryBedroom;
