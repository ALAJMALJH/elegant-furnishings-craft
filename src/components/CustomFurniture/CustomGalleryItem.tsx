
interface CustomGalleryItemProps {
  image: string;
  title: string;
  description: string;
  clientName: string;
  testimonial: string;
}

const CustomGalleryItem = ({ 
  image, 
  title, 
  description, 
  clientName, 
  testimonial 
}: CustomGalleryItemProps) => {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-playfair font-semibold mb-2">{title}</h3>
        <p className="text-furniture-accent2 text-sm mb-4">{description}</p>
        <div className="border-t pt-4 mt-4">
          <p className="italic text-sm text-furniture-accent2 mb-2">"{testimonial}"</p>
          <p className="text-sm font-medium">- {clientName}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomGalleryItem;
