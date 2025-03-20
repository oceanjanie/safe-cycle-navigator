
// Safety calculation utilities for cycling routes

export interface RouteSegment {
  id: string;
  coordinates: [number, number][];
  streetLightingScore: number; // 0-10 where 10 is well lit
  crimeScore: number; // 0-10 where 10 is low crime
  floodRiskScore: number; // 0-10 where 10 is low flood risk
  roadQualityScore: number; // 0-10 where 10 is good quality
}

export interface Route {
  id: string;
  segments: RouteSegment[];
  totalDistance: number; // in meters
  totalDuration: number; // in seconds
  safetyScore: number; // 0-100
}

export enum SafetyLevel {
  High = "high",
  Medium = "medium",
  Low = "low"
}

// Mock data for time of day - would connect to actual sunrise/sunset API
export const getDaylightFactor = (date = new Date()): number => {
  const hour = date.getHours();
  
  // Rough approximation for daylight levels
  if (hour >= 8 && hour <= 18) {
    return 1; // Full daylight
  } else if ((hour >= 6 && hour < 8) || (hour > 18 && hour <= 20)) {
    return 0.5; // Dawn/dusk
  } else {
    return 0; // Night
  }
};

// Calculate overall safety score for a route based on its segments
export const calculateRouteSafetyScore = (
  route: Route,
  time = new Date()
): number => {
  if (!route.segments.length) return 0;
  
  const daylightFactor = getDaylightFactor(time);
  
  // Calculate weighted average of all segment scores
  let totalScore = 0;
  let totalLength = 0;
  
  route.segments.forEach(segment => {
    // Get length of segment (simple approximation)
    const segmentLength = segment.coordinates.length;
    totalLength += segmentLength;
    
    // Weigh lighting score based on time of day
    const adjustedLightingScore = daylightFactor === 1 
      ? 10 // During day, lighting doesn't matter
      : segment.streetLightingScore;
    
    // Weight different factors (can be adjusted based on importance)
    const segmentScore = (
      adjustedLightingScore * 0.4 +
      segment.crimeScore * 0.3 +
      segment.floodRiskScore * 0.2 +
      segment.roadQualityScore * 0.1
    ) * 10; // Scale to 0-100
    
    totalScore += segmentScore * segmentLength;
  });
  
  return Math.round(totalScore / totalLength);
};

// Determine safety level category from numerical score
export const getSafetyLevel = (score: number): SafetyLevel => {
  if (score >= 70) return SafetyLevel.High;
  if (score >= 40) return SafetyLevel.Medium;
  return SafetyLevel.Low;
};

// Get text description of safety score
export const getSafetyDescription = (score: number): string => {
  const level = getSafetyLevel(score);
  
  switch (level) {
    case SafetyLevel.High:
      return "This route is well-lit and generally considered safe for cycling.";
    case SafetyLevel.Medium:
      return "This route has moderate safety concerns. Use caution, especially at night.";
    case SafetyLevel.Low:
      return "This route has significant safety concerns. Consider alternatives if possible.";
    default:
      return "Unable to determine route safety.";
  }
};
