'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SessionInitializer() {
  const { initializeSession, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      initializeSession();
    }
  }, [initializeSession, isInitialized]);

  // This component doesn't render anything, it just initializes the session
  return null;
}
