
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import CartChecker from '@/components/Cart/CartChecker';
import { Button } from '@/components/ui/button';

const CartCheck: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Check Your Cart</h1>
            <Link to="/cart">
              <Button variant="outline">Go to Your Cart</Button>
            </Link>
          </div>
          <p className="mb-8 text-muted-foreground">
            Enter your cart ID to view the contents of a specific cart.
          </p>
          
          <CartChecker />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CartCheck;
