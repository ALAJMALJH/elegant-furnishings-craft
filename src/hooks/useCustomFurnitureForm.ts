
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CustomFurnitureFormData {
  name: string;
  email: string;
  furnitureType: string;
  description: string;
}

export const useCustomFurnitureForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: CustomFurnitureFormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call to submit the form
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Request Submitted",
        description: "We'll contact you soon to discuss your custom furniture project.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
