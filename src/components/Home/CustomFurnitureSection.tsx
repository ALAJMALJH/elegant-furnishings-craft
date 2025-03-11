
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Thompson",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    quote:
      "The custom dining table Al Ajmal created for our client exceeded all expectations. The craftsmanship is impeccable.",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    quote:
      "From concept to creation, the team understood exactly what we wanted. Our custom bedroom set is absolutely stunning.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Property Developer",
    image: "https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=150&h=150&fit=crop",
    quote:
      "Al Ajmal's custom furniture service transformed our luxury apartments. The quality and attention to detail is unmatched.",
  },
];

const features = [
  "Personalized design consultation",
  "Premium material selection",
  "Handcrafted by master artisans",
  "Custom sizing and configurations",
  "Unique finishes and detailing",
  "Delivered and professionally installed",
];

const CustomFurnitureSection = () => {
  return (
    <section className="py-24 bg-furniture-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-furniture-dark via-furniture-dark/95 to-transparent"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent text-sm font-medium rounded-full mb-6">
              Premium Service
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-white leading-tight mb-6">
              Your Vision, Our Craftsmanship
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Experience the luxury of custom-made furniture, tailored to your exact specifications. From concept to creation, our master artisans bring your vision to life with meticulous attention to detail.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-furniture-accent mr-3 mt-1 flex-shrink-0" />
                  <p className="text-white/80">{feature}</p>
                </div>
              ))}
            </div>

            <div className="space-x-4">
              <Link
                to="/custom-furniture"
                className="px-8 py-3.5 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/90 hover:shadow-lg inline-block"
              >
                Start Your Custom Order
              </Link>
              <Link
                to="/portfolio"
                className="px-6 py-3.5 border border-white/30 text-white font-medium rounded transition-all duration-300 hover:bg-white/10 inline-block mt-4 md:mt-0"
              >
                View Portfolio
              </Link>
            </div>
          </div>

          <div className="lg:pl-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="grid gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-furniture-accent"
                    />
                    <div className="ml-4">
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/80 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/testimonials"
                className="inline-flex items-center text-furniture-accent hover:text-furniture-accent/80 transition-colors"
              >
                Read more success stories <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomFurnitureSection;
