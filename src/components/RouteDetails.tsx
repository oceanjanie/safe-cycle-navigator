
import React from 'react';
import { Route } from '../utils/safetyCalculations';
import { formatDistance, formatDuration } from '../utils/routeUtils';
import SafetyScore from './SafetyScore';
import { Clock, Route as RouteIcon } from 'lucide-react';

interface RouteDetailsProps {
  route: Route;
  isSelected: boolean;
  onSelect: () => void;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ 
  route, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      className={`neomorphism px-5 py-4 mb-3 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-2 border-primary/50 scale-[1.02]' 
          : 'border border-border hover:border-primary/30 hover:scale-[1.01]'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center mb-2">
        <SafetyScore score={route.safetyScore} size="md" />
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(route.totalDuration)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <RouteIcon className="w-4 h-4" />
            <span>{formatDistance(route.totalDistance)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mt-2">
        {route.safetyScore >= 70 && (
          <p>This route follows well-lit paths with good visibility.</p>
        )}
        {route.safetyScore >= 40 && route.safetyScore < 70 && (
          <p>This route balances speed and safety with moderate lighting.</p>
        )}
        {route.safetyScore < 40 && (
          <p>This is the fastest route but has limited lighting in some areas.</p>
        )}
      </div>
      
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-in">
          <h4 className="text-sm font-medium mb-1">Route Details</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>Street lighting: {route.segments[0].streetLightingScore > 7 ? 'Excellent' : route.segments[0].streetLightingScore > 5 ? 'Good' : 'Limited'}</li>
            <li>Road quality: {route.segments[0].roadQualityScore > 7 ? 'Excellent' : route.segments[0].roadQualityScore > 5 ? 'Good' : 'Fair'}</li>
            <li>Potential hazards: {route.segments[0].floodRiskScore < 5 ? 'Flood prone areas' : 'None detected'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;
