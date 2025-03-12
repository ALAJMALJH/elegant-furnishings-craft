
import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { Mail, Phone, MapPin, Clock, MessageSquare, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = {
  address: "Sheikh Zayed Road, Dubai, United Arab Emirates",
  email: "info@alajmalfurniture.com",
  phone: "+971 4 123 4567",
  workingHours: {
    weekdays: "10:00 AM - 9:00 PM",
    weekend: "11:00 AM - 7:00 PM",
    friday: "Closed in the morning, 2:00 PM - 9:00 PM",
  },
  social: {
    facebook: "https://facebook.com/alajmalfurniture",
    instagram: "https://instagram.com/alajmalfurniture",
    twitter: "https://twitter.com/alajmalfurniture",
    linkedin: "https://linkedin.com/company/alajmalfurniture",
  },
  locations: [
    {
      id: 1,
      name: "Al Ajmal Flagship Store",
      address: "Sheikh Zayed Road, Dubai",
      phone: "+971 4 123 4567",
      openingHours: "10:00 AM - 9:00 PM",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      lat: 25.2048,
      lng: 55.2708,
    },
    {
      id: 2,
      name: "Al Ajmal Abu Dhabi",
      address: "Al Raha Beach, Abu Dhabi",
      phone: "+971 2 123 4567",
      openingHours: "10:00 AM - 9:00 PM",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae85",
      lat: 24.4539,
      lng: 54.3773,
    },
    {
      id: 3,
      name: "Al Ajmal Outlet Store",
      address: "Dubai Festival City",
      phone: "+971 4 123 8910",
      openingHours: "11:00 AM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1532372320572-cda25653a694",
      lat: 25.2285,
      lng: 55.3273,
    },
  ],
};

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
    privacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from("faqs")
          .select("*")
          .order("display_order", { ascending: true });
        
        if (error) throw error;
        setFaqs(data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs([
          {
            question: "What are your delivery timeframes?",
            answer: "For in-stock items, delivery typically takes 3-7 business days within the UAE. For custom orders or items that need to be imported, the timeframe is generally 4-8 weeks depending on the product and specifications.",
          },
          {
            question: "Do you offer assembly services?",
            answer: "Yes, we provide professional assembly services for all our furniture. This service is complimentary for purchases above AED 5,000.",
          },
          {
            question: "What is your return policy?",
            answer: "We accept returns within 14 days of delivery for items in original condition. Custom furniture cannot be returned unless there is a manufacturing defect.",
          },
          {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to GCC countries and selected international destinations. International shipping fees and delivery timeframes vary based on the destination.",
          },
          {
            question: "How do I care for my furniture?",
            answer: "Each piece comes with specific care instructions. Generally, we recommend regular dusting, avoiding direct sunlight, and using appropriate cleaning products based on the material.",
          },
        ]);
      } finally {
        setLoadingFaqs(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.inquiryType || !formData.message || !formData.privacy) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields and accept the privacy policy",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        inquiry_type: formData.inquiryType,
        message: formData.message
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out! We'll get back to you soon.",
        variant: "default",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
        privacy: false,
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent rounded-full mb-6">
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-playfair font-semibold leading-tight mb-6">
              We'd Love to Hear From You
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Have questions about our products, services, or need assistance with your purchase? Contact our friendly team today.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="animate-fade-up">
              <h2 className="text-3xl font-playfair font-semibold mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-furniture-light flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-furniture-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visit Our Store</h3>
                    <p className="text-furniture-accent2">{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-furniture-light flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-furniture-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email Us</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-furniture-accent2 hover:text-furniture-accent transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-furniture-light flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="text-furniture-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Call Us</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-furniture-accent2 hover:text-furniture-accent transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-furniture-light flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="text-furniture-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Working Hours</h3>
                    <p className="text-furniture-accent2">
                      Monday to Thursday: {contactInfo.workingHours.weekdays}<br />
                      Friday: {contactInfo.workingHours.friday}<br />
                      Saturday to Sunday: {contactInfo.workingHours.weekend}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-furniture-light flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageSquare className="text-furniture-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                    <p className="text-furniture-accent2 mb-3">
                      Chat with our customer support team in real-time.
                    </p>
                    <button className="px-6 py-2 bg-furniture-dark text-white rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href={contactInfo.social.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-furniture-light flex items-center justify-center hover:bg-furniture-accent transition-colors"
                  >
                    <Facebook className="text-furniture-dark" />
                  </a>
                  <a 
                    href={contactInfo.social.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-furniture-light flex items-center justify-center hover:bg-furniture-accent transition-colors"
                  >
                    <Instagram className="text-furniture-dark" />
                  </a>
                  <a 
                    href={contactInfo.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-furniture-light flex items-center justify-center hover:bg-furniture-accent transition-colors"
                  >
                    <Twitter className="text-furniture-dark" />
                  </a>
                  <a 
                    href={contactInfo.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-furniture-light flex items-center justify-center hover:bg-furniture-accent transition-colors"
                  >
                    <Linkedin className="text-furniture-dark" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-white p-8 rounded-lg custom-shadow">
                <h2 className="text-3xl font-playfair font-semibold mb-6">Send Us a Message</h2>
                <p className="text-furniture-accent2 mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-furniture-dark mb-1">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
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
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-furniture-dark mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-furniture-dark mb-1">
                        Inquiry Type*
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none bg-white"
                        required
                      >
                        <option value="" disabled>Select inquiry type</option>
                        <option value="product">Product Inquiry</option>
                        <option value="order">Order Status</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="custom">Custom Furniture</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-furniture-dark mb-1">
                      Message*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded border border-furniture-muted focus:border-furniture-accent focus:outline-none"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy"
                      name="privacy"
                      checked={formData.privacy}
                      onChange={handleCheckboxChange}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="privacy" className="ml-2 text-sm text-furniture-accent2">
                      I agree to the <a href="#" className="text-furniture-accent">Privacy Policy</a> and consent to having my data processed as described.
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-furniture-dark text-white font-medium rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stores Locations Section */}
      <section className="py-20 bg-furniture-light">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">Our Stores</h2>
            <p className="section-subtitle">Visit us at one of our showrooms</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.locations.map((location, index) => (
              <div 
                key={location.id} 
                className="bg-white rounded-lg overflow-hidden custom-shadow hover-scale"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'fade-up 0.7s ease-out forwards',
                }}
              >
                <div className="h-48 relative">
                  <img 
                    src={location.image} 
                    alt={location.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl text-white font-medium">{location.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <MapPin size={18} className="text-furniture-accent mr-3 flex-shrink-0 mt-1" />
                    <p className="text-furniture-accent2">{location.address}</p>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <Phone size={18} className="text-furniture-accent mr-3 flex-shrink-0 mt-1" />
                    <p className="text-furniture-accent2">{location.phone}</p>
                  </div>
                  
                  <div className="flex items-start mb-6">
                    <Clock size={18} className="text-furniture-accent mr-3 flex-shrink-0 mt-1" />
                    <p className="text-furniture-accent2">{location.openingHours}</p>
                  </div>
                  
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2.5 border border-furniture-dark text-furniture-dark font-medium rounded hover:bg-furniture-dark hover:text-white transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Map (just a placeholder - in a real app, use an actual map component) */}
          <div className="mt-16 rounded-lg overflow-hidden h-96 bg-gray-200 relative animate-fade-up">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce" 
              alt="Map" 
              className="w-full h-full object-cover opacity-50" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-medium">
                Interactive Map Would Be Displayed Here
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Quick answers to common inquiries</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {loadingFaqs ? (
              <div className="py-10 text-center text-furniture-accent2">Loading FAQs...</div>
            ) : (
              <div className="divide-y divide-furniture-muted">
                {faqs.map((faq: any, index) => (
                  <div 
                    key={faq.id || index} 
                    className="py-6 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                    <p className="text-furniture-accent2">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <p className="mb-4 text-furniture-accent2">
                Don't see your question here?
              </p>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-furniture-dark text-white font-medium rounded transition-all duration-300 hover:bg-furniture-accent hover:text-furniture-dark"
              >
                Contact Customer Support
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Contact;
