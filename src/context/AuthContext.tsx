import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "../types";
import { currentUser } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Auto-login for development/demo purposes
  useEffect(() => {
    // Automatically set the current user from mock data when the app loads
    setUser(currentUser);
    
    // Optional: Show a toast notification about the auto-login
    toast({
      title: "Auto-login enabled",
      description: "Logged in automatically for development purposes.",
    });
  }, [toast]); // Add toast to dependency array

  const login = async (email: string, password: string) => {
    // In a real application, this would make an API call
    try {
      // Mock successful login
      if (email && password) {
        setUser(currentUser);
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${currentUser.name}!`,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    // In a real application, this would make an API call
    try {
      // Mock successful signup
      if (email && password && name && role) {
        const newUser = { ...currentUser, email, name, role };
        setUser(newUser);
        toast({
          title: "Account created",
          description: `Welcome, ${name}!`,
        });
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
