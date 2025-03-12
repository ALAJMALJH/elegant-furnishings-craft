
import React from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { ChevronRight, Award, Leaf, Users, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Banner */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
              alt="Al Ajmal Furniture Showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
          </div>
          <div className="container-custom relative h-full flex flex-col justify-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold mb-4 animate-fade-up">
              About <span className="text-furniture-accent">Al Ajmal</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white/90 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Crafting elegant furniture with passion and precision since 1997
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="animate-fade-up">
                <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">Our Story</h2>
                <p className="text-furniture-accent2 mb-6">
                  Al Ajmal Furniture was founded in 1997 with a simple mission: to create beautiful, 
                  functional furniture that transforms houses into homes. What began as a small workshop 
                  has grown into one of the region's most respected furniture brands, known for 
                  exceptional craftsmanship and timeless design.
                </p>
                <p className="text-furniture-accent2 mb-6">
                  For over two decades, we've been dedicated to perfecting our craft, combining 
                  traditional techniques with modern innovation to create pieces that stand the test of time.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
                  <Link
                    to="/shop"
                    className="px-6 py-3 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/90 flex items-center justify-center"
                  >
                    Explore Our Collection <ChevronRight size={16} className="ml-1" />
                  </Link>
                  <Link
                    to="/custom-furniture"
                    className="px-6 py-3 border border-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/10 flex items-center justify-center"
                  >
                    Custom Furniture Options
                  </Link>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
                <img
                  src="https://images.unsplash.com/photo-1581539250439-c96689b516dd"
                  alt="Furniture Craftsmen at Work"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-furniture-light">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">Our Mission & Vision</h2>
              <p className="text-furniture-accent2 text-lg mb-10">
                We aim to enhance living spaces with furniture that balances aesthetics, functionality, 
                and sustainability, creating pieces that tell a story and stand the test of time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-playfair font-semibold mb-4">Our Mission</h3>
                  <p className="text-furniture-accent2">
                    To create exceptional furniture that transforms living spaces, combining 
                    craftsmanship with innovative design to deliver pieces that exceed expectations 
                    in quality, comfort, and style.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-playfair font-semibold mb-4">Our Vision</h3>
                  <p className="text-furniture-accent2">
                    To be the premier destination for distinctive, high-quality furniture, 
                    recognized for our commitment to excellence, sustainability, and creating 
                    timeless pieces that enhance the beauty of homes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">Why Choose Al Ajmal</h2>
              <p className="text-furniture-accent2 text-lg max-w-3xl mx-auto">
                We pride ourselves on delivering exceptional quality and service that has earned the 
                trust of over 400 satisfied customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-furniture-light p-8 rounded-lg text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="w-16 h-16 bg-furniture-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-furniture-dark" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Premium Craftsmanship</h3>
                <p className="text-furniture-accent2">
                  Every piece is handcrafted by skilled artisans with meticulous attention to detail.
                </p>
              </div>

              <div className="bg-furniture-light p-8 rounded-lg text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="w-16 h-16 bg-furniture-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-furniture-dark" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Timeless Design</h3>
                <p className="text-furniture-accent2">
                  We create enduring pieces that transcend trends and remain beautiful for generations.
                </p>
              </div>

              <div className="bg-furniture-light p-8 rounded-lg text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="w-16 h-16 bg-furniture-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-furniture-dark" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Customer Satisfaction</h3>
                <p className="text-furniture-accent2">
                  With 400+ happy customers, our commitment to excellence speaks for itself.
                </p>
              </div>

              <div className="bg-furniture-light p-8 rounded-lg text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
                <div className="w-16 h-16 bg-furniture-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-furniture-dark" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Sustainable Practices</h3>
                <p className="text-furniture-accent2">
                  We source materials responsibly and use eco-friendly production methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-furniture-light">
          <div className="container-custom">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">Meet Our Team</h2>
              <p className="text-furniture-accent2 text-lg max-w-3xl mx-auto">
                The talented individuals behind our exceptional furniture creations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
                    alt="Ahmad Al-Rashid"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-playfair font-semibold mb-1">Ahmad Al-Rashid</h3>
                  <p className="text-furniture-accent mb-4">Founder & Creative Director</p>
                  <p className="text-furniture-accent2 text-sm">
                    With over 25 years in furniture design, Ahmad brings vision and expertise to every piece.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
                    alt="Sara Mohammed"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-playfair font-semibold mb-1">Sara Mohammed</h3>
                  <p className="text-furniture-accent mb-4">Head of Design</p>
                  <p className="text-furniture-accent2 text-sm">
                    Sara's innovative approach combines traditional elements with contemporary design.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857"
                    alt="Khalid Al-Farsi"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-playfair font-semibold mb-1">Khalid Al-Farsi</h3>
                  <p className="text-furniture-accent mb-4">Master Craftsman</p>
                  <p className="text-furniture-accent2 text-sm">
                    Khalid's exceptional woodworking skills and attention to detail are evident in every piece.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "400ms" }}>
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956"
                    alt="Layla Abdulrahman"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-playfair font-semibold mb-1">Layla Abdulrahman</h3>
                  <p className="text-furniture-accent mb-4">Customer Experience Director</p>
                  <p className="text-furniture-accent2 text-sm">
                    Layla ensures every customer receives personalized service from consultation to delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="relative rounded-lg overflow-hidden shadow-xl order-2 md:order-1 animate-fade-up">
                <img
                  src="https://images.unsplash.com/photo-1473893604213-3df9c15611c0"
                  alt="Sustainable Materials"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="order-1 md:order-2 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">Sustainability & Ethics</h2>
                <p className="text-furniture-accent2 mb-6">
                  At Al Ajmal, sustainability isn't just a buzzword—it's a core value that guides 
                  our operations. We're committed to minimizing our environmental footprint while 
                  maximizing the longevity and quality of our products.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-furniture-accent rounded-full flex items-center justify-center mr-4">
                      <Leaf className="w-5 h-5 text-furniture-dark" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Responsibly Sourced Materials</h3>
                      <p className="text-furniture-accent2 text-sm">
                        We partner with suppliers who share our commitment to sustainable forestry 
                        and ethical material sourcing.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-furniture-accent rounded-full flex items-center justify-center mr-4">
                      <Award className="w-5 h-5 text-furniture-dark" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Waste Reduction</h3>
                      <p className="text-furniture-accent2 text-sm">
                        Our production processes are designed to minimize waste, and we repurpose 
                        leftover materials whenever possible.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-furniture-accent rounded-full flex items-center justify-center mr-4">
                      <Users className="w-5 h-5 text-furniture-dark" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Fair Labor Practices</h3>
                      <p className="text-furniture-accent2 text-sm">
                        We ensure fair compensation and safe working conditions for all our 
                        craftspeople and employees.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-furniture-light">
          <div className="container-custom">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">What Our Customers Say</h2>
              <p className="text-furniture-accent2 text-lg max-w-3xl mx-auto">
                Don't just take our word for it—hear from our satisfied customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-furniture-accent fill-furniture-accent" />
                  ))}
                </div>
                <p className="text-furniture-accent2 italic mb-6">
                  "The dining set we purchased is absolutely stunning. The craftsmanship is exceptional, 
                  and it has become the centerpiece of our home. Worth every penny!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-furniture-muted overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Nadia Sultan</h4>
                    <p className="text-sm text-furniture-accent2">Dubai</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-furniture-accent fill-furniture-accent" />
                  ))}
                </div>
                <p className="text-furniture-accent2 italic mb-6">
                  "Al Ajmal created a custom bookshelf for my office that perfectly fits my space 
                  and style. Their attention to detail and customer service is unmatched."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-furniture-muted overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Omar Jassim</h4>
                    <p className="text-sm text-furniture-accent2">Abu Dhabi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-furniture-accent fill-furniture-accent" />
                  ))}
                </div>
                <p className="text-furniture-accent2 italic mb-6">
                  "We furnished our entire home with Al Ajmal pieces, and we couldn't be happier. 
                  The quality is exceptional, and their team made the process so easy."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-furniture-muted overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Aisha & Mohammed</h4>
                    <p className="text-sm text-furniture-accent2">Sharjah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-furniture-dark text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">Experience the Al Ajmal Difference</h2>
              <p className="text-white/80 text-lg mb-10">
                Browse our collections and discover why Al Ajmal has been the preferred choice for 
                discerning homeowners for over two decades.
              </p>
              <Link
                to="/shop"
                className="px-8 py-4 bg-furniture-accent text-furniture-dark font-medium rounded-md text-lg transition-all duration-300 hover:bg-furniture-accent/90 inline-flex items-center"
              >
                Explore Our Collection <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
