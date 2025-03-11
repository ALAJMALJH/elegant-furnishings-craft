
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { CheckCircle, Upload, Calendar, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose Furniture Type",
    description: "Select what kind of furniture piece you want to create.",
    icon: <CheckCircle className="w-10 h-10 text-furniture-accent" />,
  },
  {
    id: 2,
    title: "Select Materials & Colors",
    description: "Choose from premium materials, finishes, and color options.",
    icon: <CheckCircle className="w-10 h-10 text-furniture-accent" />,
  },
  {
    id: 3,
    title: "Specify Dimensions",
    description: "Provide exact measurements to fit your space perfectly.",
    icon: <CheckCircle className="w-10 h-10 text-furniture-accent" />,
  },
  {
    id: 4,
    title: "Upload Inspirations",
    description: "Share designs or photos that inspire your vision.",
    icon: <Upload className="w-10 h-10 text-furniture-accent" />,
  },
  {
    id: 5,
    title: "Expert Consultation",
    description: "Connect with our master craftsmen to refine your design.",
    icon: <CheckCircle className="w-10 h-10 text-furniture-accent" />,
  },
  {
    id: 6,
    title: "Finalize & Deliver",
    description: "Confirm your order and receive your custom furniture.",
    icon: <Calendar className="w-10 h-10 text-furniture-accent" />,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Thompson",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    quote:
      "The custom dining table Al Ajmal created for our client exceeded all expectations. The craftsmanship is impeccable.",
    project: "Custom 10-seater Dining Table",
    projectImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    quote:
      "From concept to creation, the team understood exactly what we wanted. Our custom bedroom set is absolutely stunning.",
    project: "Custom King Bedroom Set",
    projectImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Property Developer",
    image: "https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=150&h=150&fit=crop",
    quote:
      "Al Ajmal's custom furniture service transformed our luxury apartments. The quality and attention to detail is unmatched.",
    project: "Custom Built-in Wardrobes",
    projectImage: "https://images.unsplash.com/photo-1556020685-ae41abfc9365",
  },
];

const galleryItems = [
  {
    id: 1,
    title: "Customized L-Shaped Sectional",
    description: "Tailored to fit a specific corner of the living room with premium fabric",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
  },
  {
    id: 2,
    title: "Handcrafted Dining Table",
    description: "Solid oak dining table with brass inlays and custom dimensions",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  },
  {
    id: 3,
    title: "Bespoke King Size Bed",
    description: "Designed with integrated storage and upholstered headboard",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 4,
    title: "Custom TV Unit",
    description: "Wall-mounted entertainment center with hidden cable management",
    image: "https://images.unsplash.com/photo-1596079890744-c1a0462d0975",
  },
  {
    id: 5,
    title: "Built-in Wardrobe System",
    description: "Full wall wardrobe with custom interior organization",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8",
  },
  {
    id: 6,
    title: "Bespoke Office Desk",
    description: "Custom workspace designed for specific room dimensions and workflow",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705",
  },
];

const CustomFurniture = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen-80 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581539250439-c96689b516dd"
            alt="Custom Furniture Craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent rounded-full mb-6">
              Premium Custom Furniture
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold leading-tight mb-6">
              Your Vision, <br />Our Craftsmanship
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Experience the luxury of furniture made precisely to your specifications. From concept to creation, our master artisans bring your dreams to life with meticulous attention to detail.
            </p>
            <div className="space-x-4">
              <a
                href="#custom-form"
                className="px-8 py-3.5 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/90 hover:shadow-lg inline-block"
              >
                Start Your Custom Order
              </a>
              <a
                href="#gallery"
                className="px-6 py-3.5 border border-white/30 text-white font-medium rounded transition-all duration-300 hover:bg-white/10 inline-block mt-4 md:mt-0"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-20 bg-furniture-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
            <h2 className="section-title mb-6">Tailored Just For You</h2>
            <p className="text-lg text-furniture-accent2">
              Custom furniture offers unparalleled advantages: perfect fit for your space, expression of your unique style, superior quality and craftsmanship, and furniture that perfectly serves your specific needs. With Al Ajmal's custom furniture service, you'll work directly with our expert craftsmen to create pieces that are truly one-of-a-kind.
            </p>
          </div>
          
          {/* How It Works */}
          <div className="mt-20">
            <h2 className="section-title text-center mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className="bg-white p-8 rounded-lg custom-shadow hover-scale"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: 'fade-up 0.7s ease-out forwards',
                  }}
                >
                  <div className="flex items-center mb-4">
                    <span className="w-10 h-10 rounded-full bg-furniture-muted flex items-center justify-center text-furniture-dark font-bold mr-4">
                      {step.id}
                    </span>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-playfair font-semibold mb-3">{step.title}</h3>
                  <p className="text-furniture-accent2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">Gallery of Custom Projects</h2>
            <p className="section-subtitle">Browse through our exclusive collection of bespoke furniture</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group overflow-hidden rounded-lg custom-shadow hover-scale"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fade-up 0.7s ease-out forwards',
                }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-playfair font-semibold mb-2">{item.title}</h3>
                  <p className="text-furniture-accent2 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="#custom-form"
              className="inline-flex items-center px-6 py-3 bg-furniture-dark text-white font-medium rounded transition-all duration-300 hover:bg-furniture-accent hover:text-furniture-dark"
            >
              Create Your Own <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-furniture-dark text-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-white">What Our Clients Say</h2>
            <p className="text-xl text-white/70 mt-4">Real feedback from our satisfied custom furniture clients</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'fade-up 0.7s ease-out forwards',
                }}
              >
                <div className="h-56 relative">
                  <img 
                    src={testimonial.projectImage} 
                    alt={testimonial.project} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-medium">{testimonial.project}</h4>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-white/80 italic mb-6">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Custom Order Form */}
      <section id="custom-form" className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent text-sm font-medium rounded-full mb-6">
                Start Your Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-furniture-dark leading-tight mb-6">
                Ready to Create Your Dream Furniture?
              </h2>
              <p className="text-lg text-furniture-accent2 mb-8">
                Fill out the form and our team will get back to you within 24 hours to discuss your custom furniture requirements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-furniture-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-furniture-dark">Free design consultation with experts</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-furniture-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-furniture-dark">Premium material selection</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-furniture-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-furniture-dark">Transparent pricing with no hidden costs</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-furniture-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-furniture-dark">5-year warranty on all custom pieces</p>
                </div>
              </div>
            </div>
            
            <div className="bg-furniture-light p-8 rounded-lg custom-shadow animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-2xl font-playfair font-semibold mb-6">Custom Furniture Inquiry</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-furniture-dark mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-furniture-dark mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-furniture-dark mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="furnitureType" className="block text-sm font-medium text-furniture-dark mb-1">
                      Furniture Type*
                    </label>
                    <select
                      id="furnitureType"
                      className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none bg-white"
                      required
                    >
                      <option value="" disabled selected>Select furniture type</option>
                      <option value="sofa">Sofa / Sectional</option>
                      <option value="bed">Bed</option>
                      <option value="table">Dining Table</option>
                      <option value="wardrobe">Wardrobe</option>
                      <option value="desk">Desk / Workstation</option>
                      <option value="other">Other (please specify)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-furniture-dark mb-1">
                    Describe Your Requirements*
                  </label>
                  <textarea
                    id="requirements"
                    rows={5}
                    className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                    placeholder="Please share your ideas, dimensions, materials, or any other details about the custom furniture you're looking for."
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-furniture-dark mb-1">
                    Upload Reference Images (Optional)
                  </label>
                  <div className="border border-dashed border-furniture-muted rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-furniture-accent2 mx-auto mb-2" />
                    <p className="text-sm text-furniture-accent2">
                      Drag and drop files here or <span className="text-furniture-accent">browse</span>
                    </p>
                    <p className="text-xs text-furniture-accent2 mt-1">
                      Maximum 5 files. JPG, PNG or PDF (Max 5MB each)
                    </p>
                    <input
                      type="file"
                      id="file"
                      multiple
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-furniture-dark text-white font-medium rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors duration-300"
                >
                  Submit Inquiry
                </button>
                
                <p className="text-xs text-furniture-accent2 text-center">
                  By submitting this form, you agree to our <a href="#" className="text-furniture-accent">Privacy Policy</a> and <a href="#" className="text-furniture-accent">Terms of Service</a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default CustomFurniture;
