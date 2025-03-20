
import { Route, RouteSegment, calculateRouteSafetyScore } from './safetyCalculations';

// Mock data representing Milton Keynes cycling routes
// In a real app, this would come from an API call to routing service
export const generateMockRoutes = (
  startCoords: [number, number],
  endCoords: [number, number]
): Route[] => {
  // Mock data - would be replaced with actual API call to routing service
  const mockSegments1: RouteSegment[] = [
    {
      id: 's1',
      coordinates: [
        startCoords,
        [startCoords[0] + 0.01, startCoords[1] + 0.01],
        [startCoords[0] + 0.02, startCoords[1] + 0.015],
        [endCoords[0] - 0.01, endCoords[1] - 0.005],
        endCoords
      ],
      streetLightingScore: 8,
      crimeScore: 9,
      floodRiskScore: 7,
      roadQualityScore: 8
    }
  ];

  const mockSegments2: RouteSegment[] = [
    {
      id: 's2a',
      coordinates: [
        startCoords,
        [startCoords[0] + 0.005, startCoords[1] + 0.02],
        [startCoords[0] + 0.01, startCoords[1] + 0.025]
      ],
      streetLightingScore: 6,
      crimeScore: 7,
      floodRiskScore: 9,
      roadQualityScore: 9
    },
    {
      id: 's2b',
      coordinates: [
        [startCoords[0] + 0.01, startCoords[1] + 0.025],
        [endCoords[0] - 0.015, endCoords[1] - 0.01],
        endCoords
      ],
      streetLightingScore: 7,
      crimeScore: 8,
      floodRiskScore: 8,
      roadQualityScore: 7
    }
  ];

  const mockSegments3: RouteSegment[] = [
    {
      id: 's3',
      coordinates: [
        startCoords,
        [startCoords[0] - 0.01, startCoords[1] + 0.01],
        [startCoords[0] - 0.005, startCoords[1] + 0.03],
        [endCoords[0] - 0.02, endCoords[1] - 0.01],
        [endCoords[0] - 0.01, endCoords[1]],
        endCoords
      ],
      streetLightingScore: 4,
      crimeScore: 5,
      floodRiskScore: 6,
      roadQualityScore: 9
    }
  ];

  // Create three different routes with varying safety profiles
  const safeRoute: Route = {
    id: 'route-1',
    segments: mockSegments1,
    totalDistance: 5200, // 5.2 km
    totalDuration: 1260, // 21 minutes
    safetyScore: 0, // Will be calculated
  };
  
  const balancedRoute: Route = {
    id: 'route-2',
    segments: mockSegments2,
    totalDistance: 4800, // 4.8 km
    totalDuration: 1140, // 19 minutes
    safetyScore: 0, // Will be calculated
  };
  
  const fastRoute: Route = {
    id: 'route-3', 
    segments: mockSegments3,
    totalDistance: 4200, // 4.2 km
    totalDuration: 1020, // 17 minutes
    safetyScore: 0, // Will be calculated
  };

  // Calculate safety scores
  const currentTime = new Date();
  safeRoute.safetyScore = calculateRouteSafetyScore(safeRoute, currentTime);
  balancedRoute.safetyScore = calculateRouteSafetyScore(balancedRoute, currentTime);
  fastRoute.safetyScore = calculateRouteSafetyScore(fastRoute, currentTime);

  return [safeRoute, balancedRoute, fastRoute].sort((a, b) => b.safetyScore - a.safetyScore);
};

// Format duration from seconds to readable string
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min`;
  }
};

// Format distance from meters to readable string
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  } else {
    const kilometers = (meters / 1000).toFixed(1);
    return `${kilometers} km`;
  }
};

// Get all coordinates from a route for map display
export const getAllRouteCoordinates = (route: Route): [number, number][] => {
  const allCoordinates: [number, number][] = [];
  
  route.segments.forEach(segment => {
    segment.coordinates.forEach(coord => {
      allCoordinates.push(coord);
    });
  });
  
  return allCoordinates;
};
