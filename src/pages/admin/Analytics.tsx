
import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Analytics</h1>
      <p className="text-muted-foreground mt-2">View detailed performance metrics.</p>
      
      <div className="mt-8 p-8 bg-white rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          This is a placeholder for the Analytics page.<br />
          The full implementation would include charts, graphs, and detailed performance data.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
