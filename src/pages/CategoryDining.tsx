
import React from 'react';
import CategoryPage from '../components/Category/CategoryPage';

const diningSubcategories = [
  {
    id: "dining-tables",
    name: "Dining Tables",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    slug: "dining-tables"
  },
  {
    id: "dining-chairs",
    name: "Dining Chairs & Benches",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    slug: "dining-chairs"
  },
  {
    id: "sideboards",
    name: "Sideboards & Buffets",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    slug: "sideboards"
  },
  {
    id: "bar-stools",
    name: "Bar Stools",
    image: "https://images.unsplash.com/photo-1610099917789-a87f5c2ba057",
    slug: "bar-stools"
  },
  {
    id: "display-cabinets",
    name: "Display Cabinets",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    slug: "display-cabinets"
  }
];

const diningProducts = [
  {
    id: "dn-table-1",
    name: "8-Seater Marble Dining Table",
    price: 9999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    category: "dining",
    subcategory: "dining-tables",
    badge: "Bestseller"
  },
  {
    id: "dn-table-2",
    name: "6-Seater Solid Wood Table",
    price: 6499,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "dining",
    subcategory: "dining-tables",
    badge: "New"
  },
  {
    id: "dn-chair-1",
    name: "Upholstered Dining Chair (Set of 2)",
    price: 2699,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    category: "dining",
    subcategory: "dining-chairs"
  },
  {
    id: "dn-bench-1",
    name: "Dining Bench with Cushion",
    price: 2299,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1588208333207-38783a2f3c06",
    category: "dining",
    subcategory: "dining-chairs"
  },
  {
    id: "dn-sideboard-1",
    name: "Modern Sideboard",
    price: 5199,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    category: "dining",
    subcategory: "sideboards"
  },
  {
    id: "dn-buffet-1",
    name: "Glass Door Buffet",
    price: 4799,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    category: "dining",
    subcategory: "sideboards",
    badge: "Limited"
  },
  {
    id: "dn-stool-1",
    name: "Leather Bar Stool (Set of 2)",
    price: 2399,
    image: "https://images.unsplash.com/photo-1610099917789-a87f5c2ba057",
    category: "dining",
    subcategory: "bar-stools"
  },
  {
    id: "dn-display-1",
    name: "Glass Display Cabinet",
    price: 6299,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    category: "dining",
    subcategory: "display-cabinets"
  },
  {
    id: "dn-stool-2",
    name: "Adjustable Height Bar Stool",
    price: 1799,
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb",
    category: "dining",
    subcategory: "bar-stools"
  }
];

const diningReviews = [
  {
    id: 1,
    name: "John Smith",
    date: "August 5, 2023",
    rating: 5,
    text: "The marble dining table is a showstopper! Everyone who visits our home compliments it. Excellent quality and the delivery team was very professional.",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    productName: "Marble Dining Table"
  },
  {
    id: 2,
    name: "Layla Al Marzooqi",
    date: "July 20, 2023",
    rating: 5,
    text: "The dining chairs are both beautiful and comfortable. We've had several dinner parties and our guests always comment on how nice they are.",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    productName: "Upholstered Dining Chairs"
  },
  {
    id: 3,
    name: "Thomas Lee",
    date: "September 12, 2023",
    rating: 4,
    text: "The sideboard is exactly what we wanted. Plenty of storage and looks fantastic. Just wish it came in a lighter wood option.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    productName: "Modern Sideboard"
  }
];

const diningBlogPosts = [
  {
    id: "1",
    title: "How to Choose the Perfect Dining Table",
    excerpt: "Finding the right size, shape, and style for your space and entertaining needs.",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    date: "August 15, 2023",
    author: "Maria Rodriguez",
    category: "Buying Guide"
  },
  {
    id: "2",
    title: "Creating the Perfect Dinner Party Setting",
    excerpt: "Tips for styling your dining space to impress guests and create memorable meals.",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
    date: "July 22, 2023",
    author: "Hassan Ahmed",
    category: "Entertaining"
  },
  {
    id: "3",
    title: "Mixing and Matching Dining Chairs",
    excerpt: "How to create a designer look with different styles of dining seating.",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    date: "September 3, 2023",
    author: "Sophie Wang",
    category: "Design Trends"
  }
];

const CategoryDining = () => {
  return (
    <CategoryPage
      categorySlug="dining"
      hero={{
        title: "Dining Room Furniture",
        subtitle: "Create memorable moments with our elegant dining collection",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb"
      }}
      subcategories={diningSubcategories}
      featuredProducts={diningProducts}
      reviews={diningReviews}
      blogPosts={diningBlogPosts}
      customSectionTitle="Dine in Style with Custom Crafted Furniture"
      customSectionDescription="From bespoke dining tables sized perfectly for your space to custom china cabinets designed to showcase your treasures, our master craftsmen can create dining furniture that's perfectly tailored to your needs."
      customSectionImage="https://images.unsplash.com/photo-1615874959474-d609969a20ed"
    />
  );
};

export default CategoryDining;
