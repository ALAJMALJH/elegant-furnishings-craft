
import React from 'react';

const Sales: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Sales Management</h1>
      <p className="text-muted-foreground mt-2">Manage orders and transactions.</p>
      
      <div className="mt-8 p-8 bg-white rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          This is a placeholder for the Sales Management page.<br />
          The full implementation would include order history, transaction details, and sales reports.
        </p>
      </div>
    </div>
  );
};

export default Sales;
