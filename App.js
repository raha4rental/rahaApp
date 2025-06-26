import React, { useState, useEffect } from 'react';
import WelcomeVideoScreen from './src/screens/WelcomeVideoScreen';
import HomeScreen from './src/screens/HomeScreen';
import PropertyDetails from './src/screens/PropertyDetails';
import MaintenanceScreen from './src/screens/MaintenanceScreen';
import MedicalServicesScreen from './src/screens/MedicalServicesScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('video');
  const [screenParams, setScreenParams] = useState(null);

  // Navigation function
  const navigate = (screenName, params) => {
    setCurrentScreen(screenName);
    setScreenParams(params);
  };

  // Create a mock navigation object
  const navigation = {
    navigate: navigate,
    replace: navigate,
    goBack: () => setCurrentScreen('home'),
  };

  // Auto-navigate from video to home after video ends
  useEffect(() => {
    if (currentScreen === 'video') {
      const timer = setTimeout(() => {
        setCurrentScreen('home');
      }, 6000); // 6 seconds for video duration
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'video':
        return <WelcomeVideoScreen navigation={navigation} />;
      case 'home':
        return <HomeScreen navigation={navigation} />;
      case 'PropertyDetails':
        return <PropertyDetails route={{ params: screenParams }} navigation={navigation} />;
      case 'MaintenanceScreen':
        return <MaintenanceScreen navigation={navigation} />;
      case 'MedicalServicesScreen':
        return <MedicalServicesScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return renderScreen();
}


