
import { LucideIcon } from 'lucide-react';

interface HowItWorksStepProps {
  title: string;
  description: string;
  icon: LucideIcon;
  step: number;
}

const HowItWorksStep = ({ title, description, icon: Icon, step }: HowItWorksStepProps) => {
  return (
    <div className="relative flex flex-col items-center text-center p-6">
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-furniture-accent text-furniture-dark rounded-full flex items-center justify-center font-medium">
        {step}
      </div>
      <div className="w-16 h-16 bg-furniture-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-furniture-accent" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-furniture-accent2 text-sm">{description}</p>
    </div>
  );
};

export default HowItWorksStep;
