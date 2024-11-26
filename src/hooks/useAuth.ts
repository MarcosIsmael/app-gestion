'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isFetching = useRef(false); // Indica si hay una llamada pendiente
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard/home';
  useEffect(() => {
    const validateSession = async () => {
      if (isFetching.current) return; // Si ya hay una llamada en progreso, no hacer otra
      isFetching.current = true; // Marcar que la llamada está en progreso

      try {
        const storedUser = sessionStorage.getItem('user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          // Valida que el objeto en sessionStorage no esté expirado
          if (parsedUser?.expiration && new Date(parsedUser.expiration) > new Date()) {
            setUser(parsedUser);
            setIsAuthenticated(true);

            if (requiredRole && parsedUser.role !== requiredRole) {
              router.replace('/403'); // Acceso denegado
            }
            isFetching.current = false; // Finaliza la llamada
            return;
          }
        }

        // Llama a la API si no hay información válida en sessionStorage
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const fetchedUser = await res.json();

          const userWithExpiration = {
            ...fetchedUser,
            expiration: new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(), // Expira en 15 minutos
          };

          sessionStorage.setItem('user', JSON.stringify(userWithExpiration));
          setUser(fetchedUser);
          setIsAuthenticated(true);

          if (requiredRole && fetchedUser.role !== requiredRole) {
            router.replace('/403'); // Acceso denegado
          }
        } else {
          sessionStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);

          // Redirigir a login conservando los parámetros actuales
          const currentPath = window.location.pathname + window.location.search;
          router.replace(`/login?redirect=${redirectUrl}`);
        }
      } catch (error) {
        console.error('Error validating session:', error);
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);

        // Redirigir a login conservando los parámetros actuales
        const currentPath = window.location.pathname + window.location.search;
        router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } finally {
        isFetching.current = false; // Marca que la llamada finalizó
      }
    };

    validateSession();
  }, [requiredRole, router]);

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);

        // Redirigir a login conservando los parámetros actuales
        router.replace(`/login`);
      } else {
        console.error('Error logging out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user, 
    isAuthenticated, 
    logout
  };
}
