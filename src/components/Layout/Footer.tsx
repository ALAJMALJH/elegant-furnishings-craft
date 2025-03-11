
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, DollarSign, Truck, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-furniture-dark text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-playfair font-semibold mb-6">
              <span className="text-furniture-accent">AL</span> AJMAL
              <span className="block text-xs tracking-widest text-furniture-muted mt-1">
                FURNITURE
              </span>
            </h3>
            <p className="text-furniture-muted mb-4 text-sm leading-relaxed">
              Al Ajmal Furniture has been crafting premium quality furniture for over
              25 years. Our commitment to excellence, attention to detail, and customer
              satisfaction sets us apart in the industry.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-furniture-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-furniture-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-furniture-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-furniture"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Custom Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Blog & Inspiration
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-medium mb-6">Customer Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/warranty"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Warranty Information
                </Link>
              </li>
              <li>
                <Link
                  to="/care"
                  className="text-furniture-muted hover:text-furniture-accent transition-colors text-sm"
                >
                  Furniture Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-medium mb-6">Contact & Updates</h4>
            <div className="flex items-start mb-4">
              <MapPin size={18} className="text-furniture-accent mr-3 mt-0.5" />
              <p className="text-furniture-muted text-sm">
                123 Luxury Lane, Dubai, UAE
              </p>
            </div>
            <div className="flex items-start mb-4">
              <Phone size={18} className="text-furniture-accent mr-3 mt-0.5" />
              <p className="text-furniture-muted text-sm">+971 4 123 4567</p>
            </div>
            <div className="flex items-start mb-6">
              <Mail size={18} className="text-furniture-accent mr-3 mt-0.5" />
              <p className="text-furniture-muted text-sm">info@alajmalfurniture.com</p>
            </div>

            <h5 className="text-sm font-medium mb-3">
              Subscribe for exclusive offers
            </h5>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm rounded-l focus:outline-none flex-1"
              />
              <button className="bg-furniture-accent text-furniture-dark px-4 py-2 text-sm font-medium rounded-r">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/10 pt-10 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Truck size={24} className="text-furniture-accent mb-3" />
              <h5 className="text-sm font-medium mb-1">Free Shipping</h5>
              <p className="text-xs text-furniture-muted">On orders over AED 5000</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield size={24} className="text-furniture-accent mb-3" />
              <h5 className="text-sm font-medium mb-1">10 Year Warranty</h5>
              <p className="text-xs text-furniture-muted">On all premium furniture</p>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard size={24} className="text-furniture-accent mb-3" />
              <h5 className="text-sm font-medium mb-1">Secure Payment</h5>
              <p className="text-xs text-furniture-muted">100% secure checkout</p>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign size={24} className="text-furniture-accent mb-3" />
              <h5 className="text-sm font-medium mb-1">Easy Financing</h5>
              <p className="text-xs text-furniture-muted">0% interest for 12 months</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-furniture-muted mb-4 md:mb-0">
              © {new Date().getFullYear()} Al Ajmal Furniture. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-xs text-furniture-muted hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-furniture-muted hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/sitemap"
                className="text-xs text-furniture-muted hover:text-white transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
