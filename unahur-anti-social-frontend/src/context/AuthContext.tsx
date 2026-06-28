import { createContext, useState, useEffect, ReactNode } from 'react';

// Definición de tipos
interface User {
  id: string | number;
  nickName: string;
}

interface AuthContextType {
  user: User | null;
  login: (nickName: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Persistencia de sesión
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (nickName: string, pass: string) => {
    // Validación local de la contraseña
    if (pass !== '123456') return false; 

    try {
      // Fetch a la API local
      const response = await fetch('http://localhost:3000/users'); 
      const users: User[] = await response.json();
      
      // Verificación de existencia del usuario
      const foundUser = users.find(u => u.nickName === nickName);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en la validación", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};