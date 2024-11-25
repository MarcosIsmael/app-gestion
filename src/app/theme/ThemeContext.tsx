'use client';

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DarkTheme } from './dark';
import { LigthTheme } from './ligth';

// Crear el contexto
const ThemeContext = createContext<{
  mode: string;
  toggleTheme: () => void;
}>({
  mode: 'light',
  toggleTheme: () => {},
});

export const ThemeProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<string | null>(null); // Estado inicial es null

  // Cargar el tema desde localStorage en el cliente
  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme') || 'light';
    setMode(storedTheme);
  }, []);

  // Cambiar el tema de oscuro a claro
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    window.localStorage.setItem('theme', newMode);
  };

  // Crear el tema de MUI basado en el modo actual
  const theme = useMemo(() => {
    if (mode === null) return createTheme(); // Tema temporal durante la carga
    return mode === 'dark' ? DarkTheme : LigthTheme;
  }, [mode]);

  // Evitar renderizar el contenido hasta que el tema esté definido
  if (mode === null) return null;

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook para acceder al contexto de tema
export const useThemeContext = () => useContext(ThemeContext);
