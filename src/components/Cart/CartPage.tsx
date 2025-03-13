
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CartPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
          <CardDescription>Our products are currently unavailable</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            We are currently updating our product catalog and shopping functionality.
          </p>
          <p className="text-muted-foreground mb-6">
            All products are temporarily unavailable. Please contact us directly for any inquiries.
          </p>
          <Link to="/contact">
            <Button>Contact Us</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage;
