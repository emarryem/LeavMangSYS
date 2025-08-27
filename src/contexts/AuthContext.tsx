import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'hr';
  department: string;
  annualLeaveBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, department: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [

  {
    id: '1',
    name: 'Maram ahmed',
    email: 'maram@ed.com',
    role: 'employee',
    department: 'IT',
    annualLeaveBalance: 15
  },
  {
    id: '1',
    name: 'Mariam Ahmed',
    email: 'mariam@ed.com',
    role: 'employee',
    department: 'IT',
    annualLeaveBalance: 15
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    email: 'ahmed@ed.com',
    role: 'manager',
    department: 'IT',
    annualLeaveBalance: 21
  },
  {
    id: '3',
    name: 'Sara Mohamed',
    email: 'sara@ed.com',
    role: 'hr',
    department: 'HR',
    annualLeaveBalance: 21
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('ed-leave-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      localStorage.setItem('ed-leave-user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string, department: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser || password.length < 6) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'employee',
      department,
      annualLeaveBalance: 21
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('ed-leave-user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ed-leave-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};