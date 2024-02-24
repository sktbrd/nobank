// UserLocationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const UserLocationContext = createContext();

export const useUserLocation = () => useContext(UserLocationContext);

export const UserLocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Function to get the user's current location
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    };

    fetchLocation();
  }, []);

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};
