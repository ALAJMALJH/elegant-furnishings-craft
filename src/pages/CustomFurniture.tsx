
import { Pencil, Palette, Users, Clock, Send } from 'lucide-react';
import HowItWorksStep from '../components/CustomFurniture/HowItWorksStep';
import CustomGalleryItem from '../components/CustomFurniture/CustomGalleryItem';

const customProjects = [
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    title: "Custom L-Shaped Sofa",
    description: "Tailored to fit a unique corner space with specific dimensions",
    clientName: "Sarah & John Parker",
    testimonial: "The custom sofa fits perfectly in our space and the quality is exceptional!"
  },
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    title: "Handcrafted Dining Set",
    description: "10-seater dining table with matching chairs in premium oak",
    clientName: "Ahmed Hassan",
    testimonial: "Exactly what we envisioned for our family gatherings!"
  },
  {
    image: "https://images.unsplash.com/photo-1616137466211-f939a420be84",
    title: "Built-in Wardrobe",
    description: "Floor-to-ceiling wardrobe with custom compartments",
    clientName: "Emma Rodriguez",
    testimonial: "The attention to detail and craftsmanship is remarkable."
  }
];

const steps = [
  {
    title: "Design Consultation",
    description: "Share your vision with our expert designers",
    icon: Pencil,
  },
  {
    title: "Material Selection",
    description: "Choose from premium materials and finishes",
    icon: Palette,
  },
  {
    title: "Craftsman Review",
    description: "Our master craftsmen evaluate and plan your piece",
    icon: Users,
  },
  {
    title: "Creation & Delivery",
    description: "Your furniture is crafted and delivered to your doorstep",
    icon: Clock,
  }
];

const CustomFurniture = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618220179428-22790b461013"
            alt="Custom Furniture Craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-playfair font-semibold mb-6">
            Crafting Your Perfect Piece
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Transform your vision into reality with our custom furniture service
          </p>
          <a
            href="#custom-form"
            className="inline-flex items-center bg-furniture-accent text-furniture-dark px-8 py-3 rounded-lg font-medium hover:bg-furniture-accent/90 transition-colors"
          >
            Start Your Custom Order
          </a>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">
              Why Choose Custom Furniture?
            </h2>
            <p className="text-furniture-accent2 text-lg leading-relaxed">
              Experience the luxury of furniture that's perfectly tailored to your space and style.
              Our master craftsmen bring decades of expertise to create pieces that are uniquely yours,
              ensuring perfect fit, superior quality, and lasting beauty.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-furniture-muted">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <HowItWorksStep
                key={step.title}
                {...step}
                step={index + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-center mb-16">
            Our Custom Creations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customProjects.map((project) => (
              <CustomGalleryItem
                key={project.title}
                {...project}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="custom-form" className="py-20 bg-furniture-dark">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-playfair font-semibold text-center mb-8">
              Start Your Custom Order
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-furniture-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-furniture-accent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Furniture Type</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-furniture-accent">
                  <option value="">Select a furniture type</option>
                  <option value="sofa">Sofa / Sectional</option>
                  <option value="dining">Dining Table / Chairs</option>
                  <option value="bedroom">Bedroom Furniture</option>
                  <option value="storage">Storage / Wardrobe</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Project Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-furniture-accent"
                  placeholder="Tell us about your vision..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-furniture-accent text-furniture-dark py-3 rounded-lg font-medium hover:bg-furniture-accent/90 transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Custom Order Request
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomFurniture;
