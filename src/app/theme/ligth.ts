// theme.js

'use client'
import { createTheme } from '@mui/material/styles';

export const LigthTheme = createTheme({
  palette: {
    primary: {
      main: '#520b88', // Cambia este color según tus preferencias
      contrastText: '#ffff',
    },
    secondary: {
      main: '#9520c5', // Cambia este color según tus preferencias
      contrastText: '#ffff',
    },
    background: {
      default: '#520b88', // Color de fondo predeterminado para todos los componentes
      paper: '#520b88'
    },
    action: {
      hover: '#9520c5', // Color para hover
      active: '#9520c5', // Color para active
      focus:'#9520c5'
    },
    divider: '#a65bc5',
    text: {
      primary: '#efecec', // Color para texto
      secondary:'#9520c5'
    },
    common:{
      black:'#520b88'
    }

  },


});


