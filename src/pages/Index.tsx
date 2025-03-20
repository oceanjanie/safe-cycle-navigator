
import React, { useState, useEffect } from 'react';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { Route } from '../utils/safetyCalculations';
import { generateMockRoutes } from '../utils/routeUtils';
import Map from '../components/Map';
import RouteForm from '../components/RouteForm';
import RouteDetails from '../components/RouteDetails';
import SafetyScore from '../components/SafetyScore';
import { Info, Moon, Sun } from 'lucide-react';

const Index = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const userLocation = useGeoLocation();

  // Check if it's nighttime
  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsNightMode(currentHour < 6 || currentHour >= 19);
  }, []);

  // Generate routes when user submits form
  const handleGenerateRoutes = (start: string, end: string) => {
    setLoading(true);
    
    // Simulate API call to get routes
    setTimeout(() => {
      // In reality, we would geocode addresses to coordinates here
      
      // For demonstration, generate different mock coordinates based on inputs
      const mockStartCoords: [number, number] = start === "My Location" && userLocation.coordinates
        ? [userLocation.coordinates.lat, userLocation.coordinates.lng]
        : [52.0406, -0.7594]; // Milton Keynes center
        
      const mockEndCoords: [number, number] = [52.0546, -0.7754]; // Slightly north
      
      setStartCoords(mockStartCoords);
      setEndCoords(mockEndCoords);
      
      // Generate mock routes between these points
      const generatedRoutes = generateMockRoutes(mockStartCoords, mockEndCoords);
      setRoutes(generatedRoutes);
      setSelectedRoute(generatedRoutes[0]); // Select safest route by default
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={`min-h-screen w-full bg-background ${isNightMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8 flex flex-col h-screen max-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4 text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium">SafeCycle MK</h1>
          </div>
          
          <button 
            className="h-9 w-9 rounded-full flex items-center justify-center border border-border hover:bg-secondary transition-colors"
            onClick={() => setIsNightMode(!isNightMode)}
            aria-label={isNightMode ? "Switch to day mode" : "Switch to night mode"}
          >
            {isNightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>
        
        {/* Main content */}
        <div className="flex flex-1 gap-6 h-[calc(100vh-130px)] overflow-hidden">
          {/* Left sidebar */}
          <div className="w-full max-w-sm flex flex-col overflow-hidden">
            <div className="glassmorphism mb-5 p-5 rounded-lg">
              <h2 className="text-lg font-medium mb-4">Find Safe Routes</h2>
              <RouteForm onGenerateRoutes={handleGenerateRoutes} isLoading={loading} />
            </div>
            
            {routes.length > 0 && (
              <div className="flex-1 overflow-auto pr-1">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground flex items-center">
                  <Info className="w-4 h-4 mr-1.5" />
                  Routes ordered by safety
                </h3>
                
                {routes.map((route) => (
                  <RouteDetails
                    key={route.id}
                    route={route}
                    isSelected={selectedRoute?.id === route.id}
                    onSelect={() => setSelectedRoute(route)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Map area */}
          <div className="flex-1 glassmorphism rounded-lg overflow-hidden">
            {routes.length > 0 && startCoords && endCoords ? (
              <Map
                selectedRoute={selectedRoute}
                allRoutes={routes}
                startCoords={startCoords}
                endCoords={endCoords}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Map illustration" 
                  className="w-40 h-40 mb-6 opacity-50"
                />
                <h3 className="text-xl font-medium mb-2">Enter a destination</h3>
                <p className="text-muted-foreground max-w-md">
                  Find the safest cycling routes in Milton Keynes, optimized for street lighting and safety at night.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-auto pt-4 text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <p>© {new Date().getFullYear()} SafeCycle MK</p>
            <p>Data: OpenStreetMap Contributors</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
