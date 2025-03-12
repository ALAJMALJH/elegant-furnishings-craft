
import React from 'react';
import CartChecker from '@/components/Cart/CartChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminCartCheck: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cart Checker</CardTitle>
          <CardDescription>
            Look up any cart by ID to check its contents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This tool allows you to view the contents of any cart in your system by entering its unique ID.
            Useful for customer support and order verification.
          </p>
        </CardContent>
      </Card>
      
      <CartChecker />
    </div>
  );
};

export default AdminCartCheck;
