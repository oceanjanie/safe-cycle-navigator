
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Route, SafetyLevel, getSafetyLevel } from '../utils/safetyCalculations';

interface MapProps {
  selectedRoute: Route | null;
  allRoutes: Route[];
  startCoords: [number, number];
  endCoords: [number, number];
}

const Map: React.FC<MapProps> = ({ 
  selectedRoute, 
  allRoutes, 
  startCoords, 
  endCoords 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const routeLayers = useRef<L.Layer[]>([]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current) {
      // Center on Milton Keynes if no coordinates provided
      const initialCoords: [number, number] = startCoords || [52.0406, -0.7594];
      
      const map = L.map('map', {
        center: initialCoords,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
      
      // Add attribution in a custom position
      L.control.attribution({
        position: 'bottomright'
      }).addTo(map).setPrefix('').addAttribution('© OpenStreetMap contributors');

      // Add zoom control to top right
      L.control.zoom({
        position: 'topright'
      }).addTo(map);
      
      mapRef.current = map;
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map when routes change
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing routes
    routeLayers.current.forEach(layer => {
      if (mapRef.current) mapRef.current.removeLayer(layer);
    });
    routeLayers.current = [];
    
    // Draw all routes
    allRoutes.forEach(route => {
      const isSelected = selectedRoute && selectedRoute.id === route.id;
      const safetyLevel = getSafetyLevel(route.safetyScore);
      
      // Determine color based on safety score
      let color = '#10b981'; // green for high safety
      let weight = 5;
      let opacity = 0.7;
      
      if (safetyLevel === SafetyLevel.Medium) {
        color = '#f59e0b'; // amber for medium safety
      } else if (safetyLevel === SafetyLevel.Low) {
        color = '#ef4444'; // red for low safety
      }
      
      // Make selected route more prominent
      if (isSelected) {
        weight = 7;
        opacity = 0.9;
      }
      
      const pathOptions: L.PolylineOptions = {
        color,
        weight,
        opacity,
        className: 'route-path'
      };
      
      // Create a path for each segment of the route
      route.segments.forEach(segment => {
        const path = L.polyline(segment.coordinates, pathOptions);
        
        // Add a pulse effect to selected route
        if (isSelected) {
          path.setAttribute('stroke-dasharray', '1, 10');
          path.setAttribute('stroke-dashoffset', '0');
        }
        
        path.addTo(mapRef.current!);
        routeLayers.current.push(path);
      });
    });
    
    // Add markers for start and end points if they exist
    if (startCoords && endCoords) {
      // Custom icons for start and end points
      const startIcon = L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">A</div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      const endIcon = L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">B</div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      const startMarker = L.marker(startCoords, { icon: startIcon });
      const endMarker = L.marker(endCoords, { icon: endIcon });
      
      startMarker.addTo(mapRef.current);
      endMarker.addTo(mapRef.current);
      
      routeLayers.current.push(startMarker, endMarker);
      
      // Fit map to show all markers and routes
      if (allRoutes.length > 0) {
        const bounds = L.latLngBounds([startCoords, endCoords]);
        allRoutes.forEach(route => {
          route.segments.forEach(segment => {
            segment.coordinates.forEach(coord => {
              bounds.extend(coord);
            });
          });
        });
        
        mapRef.current.fitBounds(bounds, {
          padding: [30, 30],
          maxZoom: 15,
          animate: true
        });
      }
    }
  }, [selectedRoute, allRoutes, startCoords, endCoords]);

  return (
    <div id="map" className="w-full h-full rounded-lg overflow-hidden shadow-lg" />
  );
};

export default Map;
