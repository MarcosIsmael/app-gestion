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
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },

});


