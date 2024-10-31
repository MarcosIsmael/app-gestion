'use client'
import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DarkTheme } from './dark';
import { LigthTheme } from './ligth';

// Crear el contexto
const ThemeContext = createContext({});

export const ThemeProviderComponent = ({children}:{ children: React.ReactNode }) => {
  // Estado del tema: "light" o "dark"
  const [mode, setMode] = useState('light');

  // Cambiar el tema de oscuro a claro
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Crear el tema de MUI basado en el modo actual
  const theme = useMemo(
    () =>
     mode === 'dark' ? DarkTheme : LigthTheme,
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook para acceder al contexto de tema
export const useThemeContext = () => useContext(ThemeContext);
