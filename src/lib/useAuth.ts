import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: string;
  createdAt: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Al cargar la app, intentar refrescar access token usando cookie HttpOnly
    (async () => {
      const storedUser = apiClient.getUser();
      console.log('el usuario en este momenteo es: ' + storedUser);
      
      if (storedUser) {
        setUser(storedUser);
      }

      // Intentar refrescar token (si existe refresh cookie enviada por backend)
      try {
        const refreshed = await apiClient.refreshAccessToken();
        if (refreshed && !storedUser) {
          // Obtener perfil con el nuevo access token
          const profile: any = await apiClient.post('/auth/profile', {});
          if (profile) {
            setUser(profile as User);
            localStorage.setItem('user', JSON.stringify(profile));
          }
        }
      } catch (e) {
        // no crítico
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login({ email, password });
      setUser(response.user);
      router.push('/');
      router.refresh();
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    nombre: string,
    email: string,
    password: string,
    role?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.register({
        nombre,
        email,
        password,
        role: (role as any) || undefined,
      });
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
}
