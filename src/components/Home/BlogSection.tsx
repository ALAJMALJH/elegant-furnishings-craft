
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ChevronRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Sofa Designs for Modern Homes",
    excerpt:
      "Discover the most stylish and comfortable sofa designs that will transform your living space into a modern haven.",
    image: "https://images.unsplash.com/photo-1549187774-b4b5244aedb4",
    date: "June 10, 2023",
    author: "Sarah Williams",
    category: "Design Tips",
  },
  {
    id: 2,
    title: "How to Maintain Wooden Furniture",
    excerpt:
      "Learn the essential care tips and techniques to keep your wooden furniture looking beautiful for generations.",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd",
    date: "May 25, 2023",
    author: "Ahmed Khan",
    category: "Furniture Care",
  },
  {
    id: 3,
    title: "Latest Furniture Trends in 2023",
    excerpt:
      "Stay ahead of the curve with our guide to the hottest furniture trends that are dominating interior design this year.",
    image: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77",
    date: "April 18, 2023",
    author: "Emily Parker",
    category: "Trends",
  },
];

const BlogSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title">Blog & Inspiration</h2>
          <p className="section-subtitle">Discover ideas and tips for your home</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow hover-scale custom-shadow"
              style={{ 
                animationDelay: `${index * 150}ms`,
                opacity: 0,
                animation: 'fade-up 0.7s ease-out forwards',
              }}
            >
              <Link to={`/blog/${post.id}`} className="block image-hover-zoom">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs font-medium py-1 px-2.5 bg-furniture-accent/20 text-furniture-accent2 rounded">
                    {post.category}
                  </span>
                </div>
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-playfair font-semibold mb-3 hover:text-furniture-accent transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-furniture-accent2 text-sm mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-furniture-muted">
                  <div className="flex items-center text-sm text-furniture-accent2">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center text-sm text-furniture-accent2">
                    <User size={14} className="mr-1" />
                    {post.author}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-furniture-dark text-white font-medium rounded transition-all duration-300 hover:bg-furniture-accent hover:text-furniture-dark"
          >
            View All Articles <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
