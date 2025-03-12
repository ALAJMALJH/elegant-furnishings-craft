
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryLivingRoom from "./pages/CategoryLivingRoom";
import CategoryBedroom from "./pages/CategoryBedroom";
import CategoryDining from "./pages/CategoryDining";
import CategoryOffice from "./pages/CategoryOffice";
import CategoryOutdoor from "./pages/CategoryOutdoor";
import CustomFurniture from "./pages/CustomFurniture";
import Bestsellers from "./pages/Bestsellers";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ShopAll from "./pages/ShopAll";
import BlogInspiration from "./pages/BlogInspiration";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/living-room" element={<CategoryLivingRoom />} />
          <Route path="/category/bedroom" element={<CategoryBedroom />} />
          <Route path="/category/dining" element={<CategoryDining />} />
          <Route path="/category/office" element={<CategoryOffice />} />
          <Route path="/category/outdoor" element={<CategoryOutdoor />} />
          <Route path="/custom-furniture" element={<CustomFurniture />} />
          <Route path="/bestsellers" element={<Bestsellers />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/shop" element={<ShopAll />} />
          <Route path="/blog" element={<BlogInspiration />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
