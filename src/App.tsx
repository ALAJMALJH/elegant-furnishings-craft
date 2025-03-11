
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
