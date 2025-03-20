
import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface RouteFormProps {
  onGenerateRoutes: (start: string, end: string) => void;
  isLoading: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ onGenerateRoutes, isLoading }) => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startLocation && endLocation) {
      onGenerateRoutes(startLocation, endLocation);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <MapPin className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          placeholder="Start location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="w-full pl-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          required
        />
        
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary font-medium hover:underline"
          onClick={() => setStartLocation("My Location")}
        >
          Use my location
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Navigation className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          placeholder="Destination"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="w-full pl-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !startLocation || !endLocation}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Finding routes..." : "Find Safe Routes"}
      </button>
    </form>
  );
};

export default RouteForm;
