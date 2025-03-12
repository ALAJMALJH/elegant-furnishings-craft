
import React from 'react';

const Products: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Products Management</h1>
      <p className="text-muted-foreground mt-2">Manage your product inventory.</p>
      
      <div className="mt-8 p-8 bg-white rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          This is a placeholder for the Products Management page.<br />
          The full implementation would include product listing, editing, and inventory management.
        </p>
      </div>
    </div>
  );
};

export default Products;
