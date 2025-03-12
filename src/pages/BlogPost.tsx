
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import { blogPosts } from '../components/Home/BlogSection';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundPost = blogPosts.find(post => post.id === parseInt(id));
      setPost(foundPost || null);
    }
  }, [id]);
  
  if (!post) {
    return (
      <div className="container-custom py-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Blog post not found</h2>
          <Link 
            to="/blog"
            className="inline-flex items-center text-furniture-accent hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to all articles
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img 
          src={`${post.image}?w=1920&h=600&fit=crop&crop=faces,center`} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container-custom py-10">
        <Link 
          to="/blog"
          className="inline-flex items-center text-furniture-accent hover:underline mb-6"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to all articles
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-medium py-1 px-2.5 bg-furniture-accent/20 text-furniture-accent2 rounded">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-8 text-furniture-accent2 text-sm">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {post.date}
            </div>
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              {post.author}
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="mb-4 text-lg">
              {post.excerpt}
            </p>
            
            <p className="mb-4">
              At Al Ajmal Furniture, we believe in creating spaces that reflect your personality 
              and lifestyle. Our expert team of designers work tirelessly to bring you the latest 
              trends and timeless classics that will transform your home.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Design Philosophy</h2>
            <p className="mb-4">
              Good furniture design considers the purpose, materials, functionality, and aesthetic appeal. 
              We carefully balance these elements to create pieces that are not just beautiful but also 
              practical for everyday use.
            </p>
            
            <p className="mb-4">
              When selecting new furniture, consider the following aspects:
            </p>
            
            <ul className="list-disc pl-5 mb-6">
              <li className="mb-2">Functionality: How will the piece be used in your space?</li>
              <li className="mb-2">Size and scale: Will it fit comfortably in your room?</li>
              <li className="mb-2">Style: Does it complement your existing décor?</li>
              <li className="mb-2">Material quality: Is it built to last?</li>
              <li className="mb-2">Comfort: Will you enjoy using it daily?</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Maintenance Tips</h2>
            <p className="mb-4">
              To keep your furniture looking its best for years to come:
            </p>
            
            <ol className="list-decimal pl-5 mb-6">
              <li className="mb-2">Dust regularly with a soft, clean cloth.</li>
              <li className="mb-2">Keep wooden furniture away from direct sunlight to prevent fading.</li>
              <li className="mb-2">Use coasters under drinks to prevent water rings.</li>
              <li className="mb-2">Clean spills immediately to prevent staining.</li>
              <li className="mb-2">Apply appropriate polishes and conditioners as recommended for your specific furniture type.</li>
            </ol>
            
            <blockquote className="border-l-4 border-furniture-accent pl-4 italic my-6">
              "The details are not the details. They make the design." - Charles Eames
            </blockquote>
            
            <p>
              We hope this article has provided you with valuable insights into furniture design and care. 
              Visit our showroom to explore our latest collections and speak with our design consultants 
              about creating your perfect space.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter(relatedPost => relatedPost.id !== post.id)
                .slice(0, 2)
                .map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.id}`}
                    className="group"
                  >
                    <div className="aspect-w-16 aspect-h-9 mb-3 overflow-hidden rounded">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-medium group-hover:text-furniture-accent transition-colors">
                      {relatedPost.title}
                    </h4>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
