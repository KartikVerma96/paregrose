'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SessionInitializer() {
  const [mounted, setMounted] = useState(false);
  
  // Always call hooks unconditionally (React rules)
  const auth = useAuth();
  const { initializeSession, isInitialized } = auth || {};

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && initializeSession && !isInitialized) {
      try {
        initializeSession();
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    }
  }, [mounted, initializeSession, isInitialized]);

  // This component doesn't render anything, it just initializes the session
  return null;
}
