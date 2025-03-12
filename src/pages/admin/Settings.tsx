
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-furniture-dark">Settings</h1>
      <p className="text-muted-foreground mt-2">Configure your store settings.</p>
      
      <div className="mt-8 p-8 bg-white rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          This is a placeholder for the Settings page.<br />
          The full implementation would include store configuration, user management, and system settings.
        </p>
      </div>
    </div>
  );
};

export default Settings;
