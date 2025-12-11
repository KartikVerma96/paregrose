'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SessionInitializer() {
  const [mounted, setMounted] = useState(false);
  const { initializeSession, isInitialized } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isInitialized) {
      initializeSession();
    }
  }, [mounted, initializeSession, isInitialized]);

  // This component doesn't render anything, it just initializes the session
  return null;
}
