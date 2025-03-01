import React, {createContext, useState} from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  initializeAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initializeAuth = async () => {
    const isValid = false;
    setIsAuthenticated(isValid);
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, setIsAuthenticated, initializeAuth}}>
      {children}
    </AuthContext.Provider>
  );
};
