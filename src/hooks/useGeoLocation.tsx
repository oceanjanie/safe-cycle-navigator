
import { useState, useEffect } from 'react';

interface LocationState {
  loaded: boolean;
  coordinates: { lat: number; lng: number } | null;
  error?: { code: number; message: string };
}

// Milton Keynes city center coordinates as default
const DEFAULT_COORDINATES = { lat: 52.0406, lng: -0.7594 };

export const useGeoLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    loaded: false,
    coordinates: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        loaded: true,
        coordinates: DEFAULT_COORDINATES,
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          loaded: true,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        setLocation({
          loaded: true,
          coordinates: DEFAULT_COORDINATES,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  }, []);

  return location;
};
