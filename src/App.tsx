
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Layouts
import AdminLayout from '@/components/Admin/AdminLayout';

// Pages
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import ShopAll from '@/pages/ShopAll';
import CategoryLivingRoom from '@/pages/CategoryLivingRoom';
import CategoryBedroom from '@/pages/CategoryBedroom';
import CategoryDining from '@/pages/CategoryDining';
import CategoryOffice from '@/pages/CategoryOffice';
import CategoryOutdoor from '@/pages/CategoryOutdoor';
import Bestsellers from '@/pages/Bestsellers';
import Offers from '@/pages/Offers';
import CustomFurniture from '@/pages/CustomFurniture';
import BlogInspiration from '@/pages/BlogInspiration';
import BlogPost from '@/pages/BlogPost';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import Customers from '@/pages/admin/Customers';
import Sales from '@/pages/admin/Sales';
import Analytics from '@/pages/admin/Analytics';
import Discounts from '@/pages/admin/Discounts';
import Settings from '@/pages/admin/Settings';

// Hooks
import useAdminSetup from './hooks/useAdminSetup';

// Add UUID package for visitor tracking
import { v4 as uuidv4 } from 'uuid';

import './App.css';

// Initialize visitor ID if not already set
const initVisitorId = () => {
  if (!localStorage.getItem('visitor_id')) {
    localStorage.setItem('visitor_id', uuidv4());
  }
};

const App: React.FC = () => {
  // Initialize visitor tracking
  initVisitorId();
  
  // Set up admin functionality
  useAdminSetup();
  
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<ShopAll />} />
        <Route path="/living-room" element={<CategoryLivingRoom />} />
        <Route path="/bedroom" element={<CategoryBedroom />} />
        <Route path="/dining" element={<CategoryDining />} />
        <Route path="/office" element={<CategoryOffice />} />
        <Route path="/outdoor" element={<CategoryOutdoor />} />
        <Route path="/bestsellers" element={<Bestsellers />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/custom-furniture" element={<CustomFurniture />} />
        <Route path="/blog" element={<BlogInspiration />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="sales" element={<Sales />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </>
  );
};

export default App;
