
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatBox from "./components/Chat/ChatBox";
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
import CartPage from "./components/Cart/CartPage";
import CartCheck from "./pages/CartCheck";
import { CartProvider } from "./components/Cart/CartContext";

// Import admin pages
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Sales from "./pages/admin/Sales";
import Customers from "./pages/admin/Customers";
import Analytics from "./pages/admin/Analytics";
import Discounts from "./pages/admin/Discounts";
import Settings from "./pages/admin/Settings";
import AdminCartCheck from "./pages/admin/CartCheck";

// Create a client for react-query with retry settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 30000, // 30 seconds
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/cart-check" element={<CartCheck />} />
            
            {/* Auth route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="sales" element={<Sales />} />
                <Route path="customers" element={<Customers />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="discounts" element={<Discounts />} />
                <Route path="settings" element={<Settings />} />
                <Route path="cart-check" element={<AdminCartCheck />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBox />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
