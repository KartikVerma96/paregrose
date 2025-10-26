'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Alert from '@/components/Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((alertData) => {
    const id = Date.now() + Math.random();
    const newAlert = {
      id,
      ...alertData,
      show: true
    };
    
    console.log('Creating alert:', newAlert);
    setAlerts(prev => {
      const updated = [...prev, newAlert];
      console.log('Updated alerts array:', updated);
      return updated;
    });
    
    return id;
  }, []);

  const hideAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title, message, duration = 4000) => {
    return showAlert({ type: 'success', title, message, duration });
  }, [showAlert]);

  const showWarning = useCallback((title, message, duration = 4000) => {
    return showAlert({ type: 'warning', title, message, duration });
  }, [showAlert]);

  const showError = useCallback((title, message, duration = 5000) => {
    return showAlert({ type: 'error', title, message, duration });
  }, [showAlert]);

  const showInfo = useCallback((title, message, duration = 4000) => {
    return showAlert({ type: 'info', title, message, duration });
  }, [showAlert]);

  const value = {
    showAlert,
    hideAlert,
    clearAllAlerts,
    showSuccess,
    showWarning,
    showError,
    showInfo
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Render all alerts */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full">
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <Alert
              {...alert}
              onClose={() => hideAlert(alert.id)}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};
