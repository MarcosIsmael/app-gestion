// theme.js

'use client'
import { createTheme } from '@mui/material/styles';

export const LigthTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1995AD', // Teal
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A1D6E2', // Azul claro
      contrastText: '#000000',
    },
    background: {
      default: '#F1F1F2', // Gris claro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2A3132', // Gris oscuro para el texto
      secondary: '#1995AD', // Teal secundario para subtítulos o texto menos importante
    },
    action: {
      active: '#1995AD', // Teal para iconos activos
      disabled: '#A1D6E2', // Azul claro para iconos desactivados
    },
    icon: {
      main: '#1995AD', // Color para iconos en estado normal
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // bordes redondeados
          padding: '8px 16px',
          transition: 'background-color 0.3s, box-shadow 0.3s, transform 0.2s',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#e0e0e0', // color en hover claro
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // sombra suave para el modo claro
            transform: 'translateY(-2px)',
          },
          '&:active': {
            boxShadow: 'none',
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          color: '#ffffff', // color de texto en botón primario claro
        },
        outlinedPrimary: {
          color: '#6200ea', // color de texto en botón outlined
          border: '1px solid #6200ea',
          '&:hover': {
            backgroundColor: 'rgba(98, 0, 234, 0.08)',
          },
        },
        textPrimary: {
          color: '#6200ea',
          '&:hover': {
            backgroundColor: 'rgba(98, 0, 234, 0.08)',
          },
        },
      }},
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
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },

});


