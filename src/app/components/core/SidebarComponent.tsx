'use client'
import { useState } from 'react';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton } from '@mui/material';
import { Home, ShoppingCart, AttachMoney, ShoppingBag, Assessment, BarChart, Settings } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/app/theme/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 240;

export const SidebarComponent = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    router.push(path);
  };

  const menuItems = [
    { text: 'Home', icon: <Home /> },
    { text: 'Productos', icon: <ShoppingCart /> },
    { text: 'Ventas', icon: <AttachMoney /> },
    { text: 'Compras', icon: <ShoppingBag /> },
    { text: 'Finanzas', icon: <BarChart /> },
    { text: 'Estadisticas', icon: <Assessment /> },
    { text: 'Configuracion', icon: <Settings /> },
  ];
  const { toggleTheme, mode } = useThemeContext()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1e1e1e', color: '#ffffff' },
      }}
    >
      <Box sx={{ padding: '16px', backgroundColor: '#121212' }}>
        <Typography variant="h6" noWrap>
          My Dashboard
        </Typography>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Typography variant='h6'>
            Theme
            <IconButton onClick={toggleTheme} >
              {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Typography>
        </Box>
      </Box>
      <Divider />

      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index, `/dashboard/${item.text.toLowerCase()}`)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(144, 202, 249, 0.3)',
                  color: '#ffffff',
                  '& .MuiListItemIcon-root': { color: '#ffffff' },
                },
                '&:hover': {
                  backgroundColor: 'rgba(144, 202, 249, 0.08)',
                  color: '#90caf9',
                  '& .MuiListItemIcon-root': { color: '#90caf9' },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};



