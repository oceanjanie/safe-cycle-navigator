
import React from 'react';
import { SafetyLevel, getSafetyLevel } from '../utils/safetyCalculations';
import { Shield, AlertTriangle, AlertOctagon } from 'lucide-react';

interface SafetyScoreProps {
  score: number;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ 
  score, 
  showDescription = false,
  size = 'md'
}) => {
  const safetyLevel = getSafetyLevel(score);
  
  const getIcon = () => {
    switch (safetyLevel) {
      case SafetyLevel.High:
        return <Shield className="animate-pulse-light" />;
      case SafetyLevel.Medium:
        return <AlertTriangle />;
      case SafetyLevel.Low:
        return <AlertOctagon />;
      default:
        return <AlertTriangle />;
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': 
        return {
          container: 'text-xs',
          icon: 'w-3 h-3',
          pill: 'h-5'
        };
      case 'lg':
        return {
          container: 'text-base',
          icon: 'w-5 h-5',
          pill: 'h-8'
        };
      default: // md
        return {
          container: 'text-sm',
          icon: 'w-4 h-4',
          pill: 'h-6'
        };
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  return (
    <div className={`flex items-center gap-2 ${sizeClasses.container}`}>
      <div className={`safety-pill safety-${safetyLevel} ${sizeClasses.pill}`}>
        <span className={sizeClasses.icon}>{getIcon()}</span>
        <span>{score}/100</span>
      </div>
      
      {showDescription && (
        <p className="text-sm text-muted-foreground">
          {safetyLevel === SafetyLevel.High && "Well-lit, safe route"}
          {safetyLevel === SafetyLevel.Medium && "Use caution on this route"}
          {safetyLevel === SafetyLevel.Low && "Consider alternatives if possible"}
        </p>
      )}
    </div>
  );
};

export default SafetyScore;
