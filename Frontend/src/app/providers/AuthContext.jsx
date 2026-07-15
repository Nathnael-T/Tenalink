import { createContext, useContext, useEffect, useState } from 'react';
import { saveUser } from '../../utils/savedUsers';
import { authApi } from '../../api/auth.api';
import { ROLES } from '../../constants/roles';

const AUTH_STORAGE_KEY = 'authState';
const AuthContext = createContext(null);

const normalizeRole = (role) => {
  let value = String(role || '').toLowerCase().trim();

  if (value.startsWith('role_')) {
    value = value.substring(5);
  }

  switch (value) {
    case 'doctor':
    case 'provider':
      return ROLES.DOCTOR;

    case 'admin':
    case 'hospital_admin':
      return ROLES.HOSPITAL_ADMIN;

    case 'super_admin':
      return ROLES.SUPER_ADMIN;

    case 'patient':
    default:
      return ROLES.PATIENT;
  }
};

const getInitialAuthState = () => {
  try {
    const saved =
      localStorage.getItem(AUTH_STORAGE_KEY) ||
      localStorage.getItem('session');
    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);
    if (!parsed?.token || !parsed?.userId || !parsed?.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const initialAuthState = getInitialAuthState();
  const initialContextLoading =
    initialAuthState?.token &&
    initialAuthState?.patientId == null &&
    initialAuthState?.doctorId == null &&
    initialAuthState?.adminId == null;

  const [authState, setAuthState] = useState(initialAuthState);
  const [isLoading, setIsLoading] = useState(initialContextLoading);

  const persistAuthState = (state) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  };

  // On mount, if we have a token but no patientId/doctorId, fetch context
  const shouldFetchContext =
    authState?.token &&
    authState?.patientId == null &&
    authState?.doctorId == null &&
    authState?.adminId == null;

  useEffect(() => {
    const fetchContext = async () => {
      if (!shouldFetchContext) {
        return;
      }

      setIsLoading(true);
      try {
        const ctx = await authApi.getMe();
        const updatedState = {
          ...authState,
          patientId: ctx.patientId || null,
          doctorId: ctx.doctorId || null,
          adminId: ctx.adminId || null,
        };
        persistAuthState(updatedState);
        setAuthState(updatedState);
      } catch (error) {
        console.warn('Failed to fetch identity context:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContext();
  }, [shouldFetchContext, authState]);

  const signIn = async (identifier, password) => {
    setIsLoading(true);

    try {
      const trimmedIdentifier = identifier.trim();

      // Step 1: Login
      const loginResponse = await authApi.login({
        identifier: trimmedIdentifier,
        password,
      });

      // Step 2: Fetch full identity context
      let patientId = null;
      let doctorId = null;
      let adminId = null;

      try {
        // Temporarily store token so apiClient can use it
        const tempState = {
          token: loginResponse.token,
          userId: loginResponse.userId,
          role: normalizeRole(loginResponse.role),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tempState));

        const ctx = await authApi.getMe();
        patientId = ctx.patientId || null;
        doctorId = ctx.doctorId || null;
        adminId = ctx.adminId || null;
      } catch (ctxError) {
        console.warn('Failed to fetch identity context after login:', ctxError);
      }

      const normalizedRole = normalizeRole(loginResponse.role);

      const newAuthState = {
        token: loginResponse.token,
        userId: loginResponse.userId,
        role: normalizedRole,
        patientId,
        doctorId,
        adminId,
        email: trimmedIdentifier.includes('@') ? trimmedIdentifier : '',
        name: '',
      };

      persistAuthState(newAuthState);
      setAuthState(newAuthState);

      if (newAuthState.email) {
        saveUser({
          id: loginResponse.userId,
          email: newAuthState.email,
          name: '',
          faydaId: trimmedIdentifier.includes('@') ? '' : trimmedIdentifier,
          lastLogin: new Date().toISOString(),
        });
      }

      return {
        error: null,
        user: {
          id: loginResponse.userId,
          role: normalizedRole,
          patientId,
          doctorId,
          adminId,
        },
      };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('session');
    setAuthState(null);
  };

  // Computed user object for backward compatibility
  const user = authState
    ? {
        id: authState.userId || null,
        role: authState.role || null,
        patientId: authState.patientId || null,
        doctorId: authState.doctorId || null,
        adminId: authState.adminId || null,
        email: authState.email || '',
        name: authState.name || '',
        fayda_id: authState.fayda_id || '',
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        authState,
        user,
        token: authState?.token || null,
        userId: authState?.userId || null,
        role: authState?.role || null,
        patientId: authState?.patientId || null,
        doctorId: authState?.doctorId || null,
        adminId: authState?.adminId || null,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}
