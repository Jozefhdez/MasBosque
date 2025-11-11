import { useState } from 'react';
import { useSOSController } from '../../controllers/SOSController';
import SOSActiveView from '../components/SOSActiveView';
import SOSInactiveView from '../components/SOSInactiveView';

export default function SOSScreen() {
  
  const {
    isConnected,
    isSOSActive,
    userName,
    userPhoto,
    handleGoProfile,
    handleSOSPress,
    handleSOSCancel
  } = useSOSController();
  
  return (
    <>
      {isSOSActive ? (
        <SOSActiveView
          isConnected={isConnected}
          onSOSCancel={handleSOSCancel}
        />
      ) : (
        <SOSInactiveView
          userName={userName}
          userPhoto={userPhoto}
          isConnected={isConnected}
          onProfilePress={handleGoProfile}
          onSOSPress={handleSOSPress}
        />
      )}
    </>
  );
}