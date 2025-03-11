
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Living Room", path: "/category/living-room" },
    { name: "Bedroom", path: "/category/bedroom" },
    { name: "Dining", path: "/category/dining" },
    { name: "Office", path: "/category/office" },
    { name: "Outdoor", path: "/category/outdoor" },
    { name: "Custom", path: "/category/custom" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-3 glass shadow-sm" : "py-5 bg-transparent"
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-playfair font-bold tracking-tight text-furniture-dark">
              <span className="text-furniture-accent">AL</span> AJMAL
              <span className="block text-xs tracking-widest text-furniture-accent2 font-montserrat mt-[-4px]">
                FURNITURE
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link font-medium">
              Home
            </Link>
            <div className="relative group">
              <button className="nav-link font-medium flex items-center">
                Shop by Category
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
                <div className="grid grid-cols-1 gap-1 p-4">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="p-2 hover:bg-furniture-muted rounded transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/custom-furniture" className="nav-link font-medium">
              Custom Furniture
            </Link>
            <Link to="/bestsellers" className="nav-link font-medium">
              Bestsellers
            </Link>
            <Link to="/offers" className="nav-link font-medium">
              Offers
            </Link>
            <Link to="/contact" className="nav-link font-medium">
              Contact Us
            </Link>
          </nav>

          {/* Right Side Elements */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-white/80 rounded-full border border-furniture-muted px-3 py-1.5">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm focus:outline-none w-36 lg:w-44"
              />
              <Search size={18} className="text-furniture-accent2" />
            </div>

            <Link to="/wishlist" className="relative p-2">
              <Heart size={22} className="text-furniture-dark" />
              <span className="absolute -top-1 -right-1 bg-furniture-accent text-xs w-4 h-4 flex items-center justify-center rounded-full text-white">
                0
              </span>
            </Link>

            <Link to="/cart" className="relative p-2">
              <ShoppingCart size={22} className="text-furniture-dark" />
              <span className="absolute -top-1 -right-1 bg-furniture-accent text-xs w-4 h-4 flex items-center justify-center rounded-full text-white">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-furniture-dark" />
              ) : (
                <Menu size={24} className="text-furniture-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-screen opacity-100 py-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4">
            <Link
              to="/"
              className="py-2 px-4 hover:bg-furniture-muted rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="py-2 px-4">
              <p className="font-medium mb-2">Shop by Category</p>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="py-1.5 text-sm text-furniture-accent2 hover:text-furniture-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link
              to="/custom-furniture"
              className="py-2 px-4 hover:bg-furniture-muted rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Custom Furniture
            </Link>
            <Link
              to="/bestsellers"
              className="py-2 px-4 hover:bg-furniture-muted rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bestsellers
            </Link>
            <Link
              to="/offers"
              className="py-2 px-4 hover:bg-furniture-muted rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Offers
            </Link>
            <Link
              to="/contact"
              className="py-2 px-4 hover:bg-furniture-muted rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            
            <div className="flex items-center bg-white rounded-full border border-furniture-muted px-3 py-2 mx-4">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent text-sm focus:outline-none flex-1"
              />
              <Search size={18} className="text-furniture-accent2" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
