
import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Michael Chen",
    date: "June 15, 2023",
    rating: 5,
    text: "The attention to detail in my custom dining table is exceptional. The team at Al Ajmal understood exactly what I wanted and delivered beyond my expectations.",
    image: "https://images.unsplash.com/photo-1618219878829-43f60d4f0851",
    productName: "Custom Dining Table",
  },
  {
    id: 2,
    name: "Aisha Al Mahmoud",
    date: "May 22, 2023",
    rating: 5,
    text: "I furnished my entire living room with Al Ajmal pieces, and I couldn't be happier. The quality is outstanding, and the delivery service was impeccable.",
    image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e",
    productName: "Comfort Sofa Set",
  },
  {
    id: 3,
    name: "James Wilson",
    date: "April 3, 2023",
    rating: 5,
    text: "After searching for the perfect bedroom set for months, I finally found it at Al Ajmal. The craftsmanship is superb and worth every dirham.",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    productName: "Premium Bedroom Set",
  },
  {
    id: 4,
    name: "Fatima Rahman",
    date: "March 17, 2023",
    rating: 4,
    text: "The outdoor furniture I purchased has withstood a full summer in Dubai and still looks brand new. Very impressed with the quality and durability.",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    productName: "Outdoor Lounge Set",
  },
  {
    id: 5,
    name: "Robert Taylor",
    date: "February 8, 2023",
    rating: 5,
    text: "My experience with Al Ajmal has been nothing but positive. From the showroom visit to delivery, everything was professional and seamless.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    productName: "Executive Desk",
  },
  {
    id: 6,
    name: "Layla Al Hashemi",
    date: "January 25, 2023",
    rating: 5,
    text: "The marble coffee table I purchased is a true work of art. My guests always comment on how beautiful it is. Thank you Al Ajmal for your excellent taste.",
    image: "https://images.unsplash.com/photo-1531973486364-5fa64260d75b",
    productName: "Marble Coffee Table",
  },
];

const ReviewSection = () => {
  const [activePage, setActivePage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const handlePrevPage = () => {
    setActivePage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextPage = () => {
    setActivePage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const paginatedReviews = reviews.slice(
    activePage * itemsPerPage,
    (activePage + 1) * itemsPerPage
  );

  return (
    <section className="py-20 bg-furniture-light">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title">Customer Reviews</h2>
          <div className="flex items-center justify-center mb-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill="#D4B78F"
                className="text-furniture-accent mx-0.5"
              />
            ))}
          </div>
          <p className="section-subtitle">Over 400+ five-star reviews from satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paginatedReviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover-scale"
              style={{ 
                animationDelay: `${index * 150}ms`,
                opacity: 0,
                animation: 'fade-up 0.7s ease-out forwards',
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={review.image}
                  alt={`${review.name}'s furniture`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < review.rating ? "#D4B78F" : "#E6E2DC"}
                      className={i < review.rating ? "text-furniture-accent" : "text-furniture-muted"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-furniture-accent2">
                    {review.rating}.0
                  </span>
                </div>
                <p className="italic text-furniture-dark mb-4">"{review.text}"</p>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{review.name}</h4>
                    <p className="text-xs text-furniture-accent2">{review.date}</p>
                  </div>
                  <span className="text-xs bg-furniture-muted px-2 py-1 rounded">
                    {review.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-12 space-x-4">
          <button
            onClick={handlePrevPage}
            className="w-10 h-10 rounded-full border border-furniture-accent flex items-center justify-center hover:bg-furniture-accent/10 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} className="text-furniture-dark" />
          </button>
          
          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activePage === i ? "bg-furniture-accent w-6" : "bg-furniture-muted"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNextPage}
            className="w-10 h-10 rounded-full border border-furniture-accent flex items-center justify-center hover:bg-furniture-accent/10 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={20} className="text-furniture-dark" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
