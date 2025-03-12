
import { useEffect } from 'react';
import usePageTracker from './usePageTracker';

// This hook sets up all admin-related functionality
export const useAdminSetup = () => {
  // Set up page tracking
  usePageTracker();
  
  // Future admin setup functions can be added here
  
  return null;
};

export default useAdminSetup;
