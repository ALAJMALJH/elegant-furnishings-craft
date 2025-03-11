
import React from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/UI/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Ticket, Tag, Percent, Gift, ShoppingBag, CheckCircle } from "lucide-react";

// Offers data
const currentOffers = [
  {
    id: "o1",
    title: "Summer Sale",
    description: "Up to 40% off on selected living room furniture",
    endDate: "2023-08-31",
    badge: "Limited Time",
    couponCode: "SUMMER40",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    color: "bg-amber-500",
  },
  {
    id: "o2",
    title: "Bundle & Save",
    description: "Buy a complete bedroom set and save 25%",
    endDate: "2023-09-15",
    badge: "Bundle Offer",
    couponCode: "BUNDLE25",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    color: "bg-emerald-500",
  },
  {
    id: "o3",
    title: "Clearance Sale",
    description: "Up to 60% off on last season's collection",
    endDate: "2023-08-20",
    badge: "Clearance",
    couponCode: "CLEAR60",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe",
    color: "bg-rose-500",
  },
  {
    id: "o4",
    title: "New Customer Special",
    description: "15% off on your first purchase",
    endDate: null,
    badge: "New Customers",
    couponCode: "WELCOME15",
    image: "https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa",
    color: "bg-blue-500",
  },
  {
    id: "o5",
    title: "Free Delivery",
    description: "On all orders above AED 3,000",
    endDate: null,
    badge: "Free Shipping",
    couponCode: "SHIPFREE",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55",
    color: "bg-purple-500",
  },
];

// Discounted products
const discountedProducts = [
  {
    id: "dp1",
    name: "Elegant Comfort Sofa",
    price: 3499,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    category: "Living Room",
    badge: "Sale",
    discount: 19,
  },
  {
    id: "dp2",
    name: "Luxury Dining Set",
    price: 5999,
    originalPrice: 7999,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc",
    category: "Dining",
    badge: "Sale",
    discount: 25,
  },
  {
    id: "dp3",
    name: "Premium King Bed",
    price: 4799,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    category: "Bedroom",
    badge: "Sale",
    discount: 20,
  },
  {
    id: "dp4",
    name: "Ergonomic Office Chair",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
    category: "Office",
    badge: "Sale",
    discount: 33,
  },
  {
    id: "dp5",
    name: "Designer Coffee Table",
    price: 1499,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1601392740426-907c7b028119",
    category: "Living Room",
    badge: "Sale",
    discount: 25,
  },
  {
    id: "dp6",
    name: "Outdoor Lounge Set",
    price: 3799,
    originalPrice: 4599,
    image: "https://images.unsplash.com/photo-1605365070248-299a182a9ca4",
    category: "Outdoor",
    badge: "Sale",
    discount: 17,
  },
  {
    id: "dp7",
    name: "Modern Bookshelf",
    price: 1999,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1588329943841-56eb1a3480a5",
    category: "Living Room",
    badge: "Sale",
    discount: 20,
  },
  {
    id: "dp8",
    name: "Marble Side Table",
    price: 1299,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
    category: "Living Room",
    badge: "Sale",
    discount: 28,
  },
];

// Exclusive bundle deals
const bundleDeals = [
  {
    id: "b1",
    title: "Complete Living Room Set",
    description: "3-Seater Sofa, 2 Accent Chairs, Coffee Table & Side Table",
    price: 8999,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1560448204-61dc36dc98c8",
    savings: "25%",
  },
  {
    id: "b2",
    title: "Master Bedroom Collection",
    description: "King Bed, 2 Nightstands, Dresser & Wardrobe",
    price: 12499,
    originalPrice: 16999,
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64b2a",
    savings: "26%",
  },
  {
    id: "b3",
    title: "Dining Room Essentials",
    description: "6-Seater Dining Table, Chairs & Sideboard",
    price: 7999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    savings: "20%",
  },
];

// Membership benefits
const membershipBenefits = [
  {
    icon: <Percent className="w-10 h-10 text-furniture-accent" />,
    title: "Exclusive Discounts",
    description: "Members receive an additional 10% off on all purchases, including sale items",
  },
  {
    icon: <Gift className="w-10 h-10 text-furniture-accent" />,
    title: "Birthday Rewards",
    description: "Special gift or discount during your birthday month",
  },
  {
    icon: <ShoppingBag className="w-10 h-10 text-furniture-accent" />,
    title: "Early Access",
    description: "Shop new collections and sales before they're available to the public",
  },
  {
    icon: <Tag className="w-10 h-10 text-furniture-accent" />,
    title: "Points Program",
    description: "Earn points with every purchase that can be redeemed for discounts",
  },
];

// Function to calculate days remaining until a given date
const getDaysRemaining = (endDate: string | null) => {
  if (!endDate) return null;
  
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = Number(end) - Number(today); // Convert to number using Number()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

const Offers = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            alt="Special Offers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent rounded-full mb-6">
              Limited Time Deals
            </span>
            <h1 className="text-5xl md:text-6xl font-playfair font-semibold leading-tight mb-6">
              Special Offers & Promotions
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Discover incredible savings on luxury furniture. Don't miss these exclusive deals and promotions.
            </p>
            <a
              href="#current-offers"
              className="px-8 py-3.5 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/90 hover:shadow-lg inline-block"
            >
              View All Offers
            </a>
          </div>
        </div>
      </section>
      
      {/* Current Promotions Section */}
      <section id="current-offers" className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">Current Promotions</h2>
            <p className="section-subtitle">Limited-time offers and exclusive deals</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {currentOffers.map((offer, index) => {
              const daysRemaining = getDaysRemaining(offer.endDate);
              
              return (
                <div 
                  key={offer.id} 
                  className="group bg-white rounded-lg overflow-hidden custom-shadow hover-scale"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: 'fade-up 0.7s ease-out forwards',
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div className="h-64 md:h-full overflow-hidden relative">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className={`absolute top-4 left-4 ${offer.color} text-white text-xs font-bold px-3 py-1 rounded`}>
                        {offer.badge}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-playfair font-semibold mb-2">{offer.title}</h3>
                        <p className="text-furniture-accent2 mb-4">{offer.description}</p>
                        
                        {offer.endDate && (
                          <div className="flex items-center text-furniture-dark mb-4">
                            <Clock size={18} className="mr-2 text-furniture-accent" />
                            {daysRemaining > 0 ? (
                              <span>Ends in {daysRemaining} days</span>
                            ) : (
                              <span>Offer expired</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center mb-6">
                          <Ticket size={18} className="mr-2 text-furniture-accent" />
                          <div className="font-medium">Use Code: 
                            <span className="ml-2 bg-furniture-light px-3 py-1 rounded text-furniture-accent">
                              {offer.couponCode}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <a
                        href="#"
                        className="block text-center py-3 bg-furniture-dark text-white font-medium rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors duration-300"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Discounted Products Section */}
      <section className="py-20 bg-furniture-light">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">On Sale Now</h2>
            <p className="section-subtitle">Grab these items at unbeatable prices</p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="living">Living Room</TabsTrigger>
                <TabsTrigger value="bedroom">Bedroom</TabsTrigger>
                <TabsTrigger value="dining">Dining</TabsTrigger>
                <TabsTrigger value="office">Office</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {discountedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    badge={`${product.discount}% OFF`}
                    originalPrice={product.originalPrice}
                    delay={index * 100}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="living" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {discountedProducts
                  .filter(product => product.category === "Living Room")
                  .map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      badge={`${product.discount}% OFF`}
                      originalPrice={product.originalPrice}
                      delay={index * 100}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bedroom" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {discountedProducts
                  .filter(product => product.category === "Bedroom")
                  .map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      badge={`${product.discount}% OFF`}
                      originalPrice={product.originalPrice}
                      delay={index * 100}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="dining" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {discountedProducts
                  .filter(product => product.category === "Dining")
                  .map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      badge={`${product.discount}% OFF`}
                      originalPrice={product.originalPrice}
                      delay={index * 100}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="office" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {discountedProducts
                  .filter(product => product.category === "Office")
                  .map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                      badge={`${product.discount}% OFF`}
                      originalPrice={product.originalPrice}
                      delay={index * 100}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-furniture-dark text-white font-medium rounded transition-all duration-300 hover:bg-furniture-accent hover:text-furniture-dark"
            >
              View All Sale Items
            </a>
          </div>
        </div>
      </section>
      
      {/* Bundle Deals Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="section-title">Bundle & Save</h2>
            <p className="section-subtitle">Get complete furniture sets at discounted prices</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bundleDeals.map((bundle, index) => (
              <div 
                key={bundle.id} 
                className="bg-white rounded-lg overflow-hidden custom-shadow hover-scale"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'fade-up 0.7s ease-out forwards',
                }}
              >
                <div className="relative">
                  <img 
                    src={bundle.image} 
                    alt={bundle.title} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute top-4 right-4 bg-furniture-accent text-furniture-dark text-sm font-bold px-3 py-1 rounded-full">
                    Save {bundle.savings}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-playfair font-semibold mb-3">{bundle.title}</h3>
                  <p className="text-furniture-accent2 text-sm mb-4">{bundle.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xl font-medium">AED {bundle.price.toLocaleString()}</span>
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        AED {bundle.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    
                    <span className="text-emerald-500 text-sm font-medium">
                      You save AED {(bundle.originalPrice - bundle.price).toLocaleString()}
                    </span>
                  </div>
                  
                  <a
                    href="#"
                    className="block text-center py-3 bg-furniture-dark text-white font-medium rounded hover:bg-furniture-accent hover:text-furniture-dark transition-colors duration-300"
                  >
                    View Bundle
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Loyalty Program Section */}
      <section className="py-20 bg-furniture-dark text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="inline-block px-4 py-1.5 bg-furniture-accent/20 text-furniture-accent text-sm font-medium rounded-full mb-6">
                Exclusive Benefits
              </span>
              <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-white leading-tight mb-6">
                Join Our Loyalty Program
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Become a member of Al Ajmal's loyalty program and enjoy exclusive benefits, special discounts, and more.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {membershipBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1">{benefit.icon}</div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">{benefit.title}</h3>
                      <p className="text-white/70 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <a
                href="#"
                className="inline-flex items-center px-8 py-3.5 bg-furniture-accent text-furniture-dark font-medium rounded transition-all duration-300 hover:bg-furniture-accent/90 hover:shadow-lg"
              >
                Join Now
              </a>
            </div>
            
            <div className="lg:pl-12 relative animate-fade-up" style={{ animationDelay: '200ms' }}>
              <img 
                src="https://images.unsplash.com/photo-1556742212-5b321f3c261b" 
                alt="Loyalty Program" 
                className="rounded-lg shadow-xl" 
              />
              
              <div className="absolute -bottom-8 -left-8 bg-white text-furniture-dark p-6 rounded-lg shadow-lg max-w-xs">
                <CheckCircle className="w-10 h-10 text-furniture-accent mb-4" />
                <h3 className="text-lg font-medium mb-2">First Purchase Offer</h3>
                <p className="text-furniture-accent2 text-sm">
                  Join today and get 15% off on your first purchase as a member!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Offers;
