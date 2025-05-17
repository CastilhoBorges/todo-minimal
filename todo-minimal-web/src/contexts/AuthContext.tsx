import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { User, AuthContextType } from '@/types';
import authService from '@/services/auth.service';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authService.login(email, password);
      setUser(user);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      toast({
        title: 'Login failed',
        description: err instanceof Error ? err.message : 'Failed to login',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authService.register(name, email, password);
      setUser(user);
      toast({
        title: 'Registration successful',
        description: `Welcome, ${user.name}!`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      toast({
        title: 'Registration failed',
        description: err instanceof Error ? err.message : 'Failed to register',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
