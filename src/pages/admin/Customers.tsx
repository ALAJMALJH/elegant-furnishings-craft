
import React from 'react';

const Customers: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Customer Management</h1>
      <p className="text-muted-foreground mt-2">Manage customer accounts and information.</p>
      
      <div className="mt-8 p-8 bg-white rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          This is a placeholder for the Customer Management page.<br />
          The full implementation would include customer lists, details, and communication tools.
        </p>
      </div>
    </div>
  );
};

export default Customers;
