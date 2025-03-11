
import React from 'react';
import CategoryPage from '../components/Category/CategoryPage';

const officeSubcategories = [
  {
    id: "desks",
    name: "Desks & Workstations",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
    slug: "desks"
  },
  {
    id: "chairs",
    name: "Ergonomic Chairs",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    slug: "chairs"
  },
  {
    id: "storage",
    name: "Storage & Cabinets",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    slug: "storage"
  },
  {
    id: "conference",
    name: "Conference Tables",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    slug: "conference"
  },
  {
    id: "reception",
    name: "Reception & Lounge",
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea",
    slug: "reception"
  }
];

const officeProducts = [
  {
    id: "of-desk-1",
    name: "Executive Desk",
    price: 7999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
    category: "office",
    subcategory: "desks",
    badge: "Bestseller"
  },
  {
    id: "of-desk-2",
    name: "Adjustable Height Desk",
    price: 4999,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd",
    category: "office",
    subcategory: "desks",
    badge: "New"
  },
  {
    id: "of-chair-1",
    name: "Premium Ergonomic Chair",
    price: 3699,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "office",
    subcategory: "chairs"
  },
  {
    id: "of-chair-2",
    name: "Mesh Back Office Chair",
    price: 1899,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b",
    category: "office",
    subcategory: "chairs"
  },
  {
    id: "of-storage-1",
    name: "Filing Cabinet",
    price: 2199,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    category: "office",
    subcategory: "storage"
  },
  {
    id: "of-storage-2",
    name: "Bookcase with Glass Doors",
    price: 3799,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    category: "office",
    subcategory: "storage",
    badge: "Limited"
  },
  {
    id: "of-conference-1",
    name: "10-Person Conference Table",
    price: 8499,
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    category: "office",
    subcategory: "conference"
  },
  {
    id: "of-reception-1",
    name: "Reception Desk",
    price: 5999,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    category: "office",
    subcategory: "reception"
  },
  {
    id: "of-lounge-1",
    name: "Office Lounge Sofa",
    price: 4299,
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea",
    category: "office",
    subcategory: "reception"
  }
];

const officeReviews = [
  {
    id: 1,
    name: "James Wilson",
    date: "August 22, 2023",
    rating: 5,
    text: "The executive desk is not only beautiful but extremely functional. The craftsmanship is outstanding and worth every dirham.",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
    productName: "Executive Desk"
  },
  {
    id: 2,
    name: "Mariam Al Hashemi",
    date: "July 15, 2023",
    rating: 5,
    text: "After years of back pain, this ergonomic chair has been a game-changer. It's comfortable for long working hours and looks great in my home office.",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    productName: "Ergonomic Chair"
  },
  {
    id: 3,
    name: "David Park",
    date: "September 5, 2023",
    rating: 4,
    text: "The filing cabinet is well-made and matches our office décor perfectly. I wish it had come with drawer dividers, but otherwise it's perfect.",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    productName: "Filing Cabinet"
  }
];

const officeBlogPosts = [
  {
    id: 1,
    title: "Creating a Productive Home Office",
    excerpt: "Essential furniture pieces and layout tips for a workspace that boosts focus and efficiency.",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
    date: "August 18, 2023",
    author: "Mark Johnson",
    category: "Productivity"
  },
  {
    id: 2,
    title: "Ergonomics 101: Choosing the Right Office Chair",
    excerpt: "How to select a chair that supports good posture and prevents work-related pain.",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    date: "July 25, 2023",
    author: "Sara Al Mansouri",
    category: "Ergonomics"
  },
  {
    id: 3,
    title: "Office Storage Solutions for Any Space",
    excerpt: "Clever ways to organize paperwork, supplies, and equipment in offices of all sizes.",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    date: "September 10, 2023",
    author: "Thomas Lee",
    category: "Organization"
  }
];

const CategoryOffice = () => {
  return (
    <CategoryPage
      categorySlug="office"
      hero={{
        title: "Office Furniture",
        subtitle: "Create a productive workspace with our premium office collection",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2"
      }}
      subcategories={officeSubcategories}
      featuredProducts={officeProducts}
      reviews={officeReviews}
      blogPosts={officeBlogPosts}
      customSectionTitle="Elevate Your Workspace with Custom Office Furniture"
      customSectionDescription="From executive desks tailored to your exact specifications to custom storage solutions designed for your unique needs, our craftsmen can create office furniture that enhances both productivity and style."
      customSectionImage="https://images.unsplash.com/photo-1593062096033-9a26b09da705"
    />
  );
};

export default CategoryOffice;
