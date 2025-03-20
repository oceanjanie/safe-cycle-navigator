
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { searchLocations } from '../utils/locationData';

interface RouteFormProps {
  onGenerateRoutes: (start: string, end: string) => void;
  isLoading: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ onGenerateRoutes, isLoading }) => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<{ id: number; name: string; coordinates: [number, number] }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (endLocation.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const results = searchLocations(endLocation);
    setSuggestions(results);
  }, [endLocation]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startLocation && endLocation) {
      onGenerateRoutes(startLocation, endLocation);
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (locationName: string) => {
    setEndLocation(locationName);
    setShowSuggestions(false);
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

        <Popover open={showSuggestions && suggestions.length > 0} onOpenChange={setShowSuggestions}>
          <PopoverTrigger asChild>
            <div className="w-full">
              <Input
                ref={searchRef}
                type="text"
                placeholder="Destination"
                value={endLocation}
                onChange={(e) => {
                  setEndLocation(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup heading="Milton Keynes Locations">
                  {suggestions.length === 0 ? (
                    <CommandEmpty>No results found</CommandEmpty>
                  ) : (
                    suggestions.map((location) => (
                      <CommandItem
                        key={location.id}
                        onSelect={() => handleSelectSuggestion(location.name)}
                        className="cursor-pointer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {location.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
