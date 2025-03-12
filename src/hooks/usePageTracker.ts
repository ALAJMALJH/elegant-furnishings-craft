
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Helper to get or create visitor ID
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Helper to determine traffic source
const getTrafficSource = (referrer: string) => {
  if (!referrer) return 'direct';
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook') || referrer.includes('instagram') || 
      referrer.includes('twitter') || referrer.includes('linkedin')) {
    return 'social';
  }
  return 'referral';
};

export const usePageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    const trackPageVisit = async () => {
      const visitorId = getVisitorId();
      const referrer = document.referrer;
      const userAgent = navigator.userAgent;
      const source = getTrafficSource(referrer);
      
      try {
        await supabase.functions.invoke('track-visit', {
          body: {
            pagePath: location.pathname,
            visitorId,
            referrer,
            userAgent,
            source
          }
        });
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };
    
    trackPageVisit();
  }, [location.pathname]);
};

export default usePageTracker;
