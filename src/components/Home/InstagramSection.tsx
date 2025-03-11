
import React from "react";
import { Instagram } from "lucide-react";

const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    likes: 245,
    comments: 18,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    likes: 312,
    comments: 24,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    likes: 178,
    comments: 12,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200",
    likes: 294,
    comments: 32,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1617098474202-0d0d7f60c56a",
    likes: 187,
    comments: 15,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1577722422778-0ff3694f8879",
    likes: 203,
    comments: 22,
  },
];

const InstagramSection = () => {
  return (
    <section className="py-20 bg-furniture-light">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center px-5 py-2 bg-pink-50 text-pink-600 rounded-full mb-6">
            <Instagram size={18} className="mr-2" />
            <span className="font-medium">@alajmalfurniture</span>
          </div>
          <h2 className="section-title mb-4">Get Inspired on Instagram</h2>
          <p className="text-furniture-accent2 max-w-2xl mx-auto">
            Tag us in your photos with #AlAjmalFurniture for a chance to be featured on our page and win exclusive discounts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              key={post.id}
              className="block group relative rounded-lg overflow-hidden hover-scale"
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                animation: 'fade-up 0.7s ease-out forwards',
              }}
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-furniture-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <Instagram size={24} className="text-white mb-2" />
                <div className="flex space-x-3 text-white text-sm">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
