import { createContext, useState, type ReactNode } from 'react';

// 1. Definimos los tipos para TypeScript
export interface User {
  id: string | number;
  nickName: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 2. Creamos el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creamos el Provider que envolverá nuestra app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializamos el estado leyendo el localStorage por si el usuario recargó la página
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Función para guardar el usuario en el estado y en localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('loggedUser', JSON.stringify(userData));
  };

  // Función para limpiar la sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};