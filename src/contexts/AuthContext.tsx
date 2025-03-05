import React, {createContext, useState} from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  initializeAuth: () => Promise<void>;
  mode: 'supervisor' | 'client';
  setMode: React.Dispatch<React.SetStateAction<'supervisor' | 'client'>>;
  storeCode: string | null;
  initStoreCode: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState<'supervisor' | 'client'>('supervisor');
  const [storeCode, initStoreCode] = useState<string | null>(null);

  const initializeAuth = async () => {
    const isValid = false;
    setIsAuthenticated(isValid);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        initializeAuth,
        mode,
        setMode,
        storeCode,
        initStoreCode,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
