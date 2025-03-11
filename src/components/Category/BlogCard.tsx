
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from './CategoryPage';

interface BlogCardProps {
  post: BlogPost;
  delay?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, delay = 0 }) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow hover-scale custom-shadow"
      style={{ 
        animationDelay: `${delay}ms`,
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
  );
};

export default BlogCard;
