
// Sample locations in Milton Keynes for autocomplete suggestions
export const miltonKeynesLocations = [
  { id: 1, name: "Central Milton Keynes Shopping Centre", coordinates: [52.0406, -0.7594] },
  { id: 2, name: "Milton Keynes Central Station", coordinates: [52.0344, -0.7741] },
  { id: 3, name: "Campbell Park", coordinates: [52.0438, -0.7468] },
  { id: 4, name: "Stadium MK", coordinates: [52.0097, -0.7332] },
  { id: 5, name: "The Open University", coordinates: [52.0249, -0.7104] },
  { id: 6, name: "Willen Lake", coordinates: [52.0531, -0.7282] },
  { id: 7, name: "Bletchley Park", coordinates: [51.9977, -0.7408] },
  { id: 8, name: "intu Milton Keynes", coordinates: [52.0410, -0.7575] },
  { id: 9, name: "Xscape Milton Keynes", coordinates: [52.0442, -0.7554] },
  { id: 10, name: "Milton Keynes University Hospital", coordinates: [52.0133, -0.7384] },
  { id: 11, name: "The National Bowl", coordinates: [52.0142, -0.7587] },
  { id: 12, name: "Gulliver's Land", coordinates: [52.0626, -0.7222] },
  { id: 13, name: "Wolverton", coordinates: [52.0645, -0.8050] },
  { id: 14, name: "Newport Pagnell", coordinates: [52.0872, -0.7220] },
  { id: 15, name: "Milton Keynes Village", coordinates: [52.0309, -0.7108] }
];

/**
 * Search for locations matching the query string
 */
export function searchLocations(query: string) {
  if (!query) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return miltonKeynesLocations
    .filter(location => 
      location.name.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, 6); // Limit to 6 results
}
