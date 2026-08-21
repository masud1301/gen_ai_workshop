import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { db, DEMO_USERS_LIST } from '../services/db';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    department?: string;
    studentId?: string;
    roomOrOffice?: string;
    phone?: string;
    avatar?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  demoLogin: (role: UserRole) => User;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionUser, setSessionUser] = useState<User>(() => {
    const existingSession = db.auth.getSession();
    if (existingSession) {
      return existingSession.user;
    }
    const savedRole = localStorage.getItem('smartfix_demo_role') as UserRole;
    if (savedRole) {
      const match = db.users.getAll().find(u => u.role === savedRole) || DEMO_USERS_LIST.find(u => u.role === savedRole);
      if (match) return match;
    }
    return DEMO_USERS_LIST[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!db.auth.getSession() || true;
  });

  const [users, setUsers] = useState<User[]>(() => db.users.getAll());

  // Listen to DB updates
  const refreshAuth = useCallback(() => {
    setUsers(db.users.getAll());
    const sess = db.auth.getSession();
    if (sess) {
      setSessionUser(sess.user);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = db.subscribe(refreshAuth);
    return () => unsubscribe();
  }, [refreshAuth]);

  useEffect(() => {
    localStorage.setItem('smartfix_demo_role', sessionUser.role);
  }, [sessionUser]);

  const switchRole = (role: UserRole) => {
    const u = db.auth.demoLogin(role);
    setSessionUser(u);
    setIsAuthenticated(true);
  };

  const demoLogin = (role: UserRole): User => {
    const u = db.auth.demoLogin(role);
    setSessionUser(u);
    setIsAuthenticated(true);
    return u;
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = db.auth.login(email, password);
    if (res.success && res.user) {
      setSessionUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    department?: string;
    studentId?: string;
    roomOrOffice?: string;
    phone?: string;
    avatar?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = db.auth.register(userData);
    if (res.success && res.user) {
      setSessionUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = () => {
    db.auth.clearSession();
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    const updated = db.users.update(sessionUser.id, updates);
    if (updated) {
      setSessionUser(updated);
      db.auth.setSession(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: sessionUser,
        isAuthenticated,
        users,
        login,
        register,
        demoLogin,
        logout,
        switchRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

