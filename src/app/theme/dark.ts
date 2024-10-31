// theme.js
'use client'
import { createTheme } from '@mui/material/styles';

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A1D6E2', // Azul claro para elementos primarios, visible en fondo oscuro
      contrastText: '#1B1B1B', // Color oscuro para el contraste de texto en elementos primarios
    },
    secondary: {
      main: '#1995AD', // Teal para elementos secundarios y de acento
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212', // Fondo oscuro típico para un modo oscuro
      paper: '#1E1E1E', // Ligeramente más claro para áreas de contenido
    },
    text: {
      primary: '#E0E0E0', // Blanco grisáceo para el texto principal
      secondary: '#A1D6E2', // Azul claro para subtítulos o texto menos importante
    },
    action: {
      active: '#A1D6E2', // Azul claro para iconos activos
      disabled: '#757575', // Gris tenue para iconos desactivados
    },
    icon: {
      main: '#A1D6E2', // Azul claro para iconos generales
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#333333',
          },
        },
      },
    },
  },
});


