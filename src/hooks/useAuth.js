import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

// Redux hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hook for auth state and actions
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const loginWithCredentials = useCallback(
    (credentials) => {
      const { loginWithCredentials: loginAction } = require('@/features/auth/authSlice');
      return dispatch(loginAction(credentials));
    },
    [dispatch]
  );

  const loginWithGoogle = useCallback(() => {
    const { loginWithGoogle: googleLoginAction } = require('@/features/auth/authSlice');
    return dispatch(googleLoginAction());
  }, [dispatch]);

  const registerUser = useCallback(
    (userData) => {
      const { registerUser: registerAction } = require('@/features/auth/authSlice');
      return dispatch(registerAction(userData));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    const { logoutUser: logoutAction } = require('@/features/auth/authSlice');
    return dispatch(logoutAction());
  }, [dispatch]);

  const initializeSession = useCallback(() => {
    const { initializeSession: initAction } = require('@/features/auth/authSlice');
    return dispatch(initAction());
  }, [dispatch]);

  const clearError = useCallback(() => {
    const { clearError: clearErrorAction } = require('@/features/auth/authSlice');
    return dispatch(clearErrorAction());
  }, [dispatch]);

  return {
    // State
    user: auth.user,
    error: auth.error,
    loading: auth.loading,
    isInitialized: auth.isInitialized,
    isAuthenticated: !!auth.user,
    
    // Actions
    loginWithCredentials,
    loginWithGoogle,
    registerUser,
    logoutUser,
    initializeSession,
    clearError,
  };
};
