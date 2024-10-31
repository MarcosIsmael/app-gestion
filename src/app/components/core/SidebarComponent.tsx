'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton } from '@mui/material';
import { Home, ShoppingCart, AttachMoney, ShoppingBag, Assessment, BarChart, Settings, ArrowBackIos, ArrowForward } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeContext } from '@/app/theme/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 240;

export const SidebarComponent = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname()
  const { toggleTheme, mode } = useThemeContext();
  const [open, setOpen] = useState(false);

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    router.push(path);
  };

  const toggleDrawer = useCallback(() => setOpen(prevOpen => !prevOpen), []);
  
  const handleOutsideClick = useCallback((event) => {
    if (!event.target.closest('.MuiDrawer-paper') && open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [handleOutsideClick]);
  console.log('pathname', pathname)
  useEffect(() => {
    const currentPath = router;
    const currentIndex = menuItems.findIndex(item => item.text.includes(pathname));
    if (currentIndex !== -1) {
      setSelectedIndex(currentIndex);
    }
  }, [pathname]);
  const menuItems = [
    { text: 'Home', icon: <Home /> },
    { text: 'Productos', icon: <ShoppingCart /> },
    { text: 'Ventas', icon: <AttachMoney /> },
    { text: 'Compras', icon: <ShoppingBag /> },
    { text: 'Finanzas', icon: <BarChart /> },
    { text: 'Estadisticas', icon: <Assessment /> },
    { text: 'Configuracion', icon: <Settings /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : 64,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          overflowX: 'hidden',
        },
      }}
    >
      <Box width="100%" justifyContent="flex-end" display="flex">
        <IconButton onClick={toggleDrawer}>
          {open ? <ArrowBackIos /> : <ArrowForward />}
        </IconButton>
      </Box>
      <Box sx={{ padding: open ? '16px' : '8px', backgroundColor: '#121212', textAlign: open ? 'left' : 'center' }}>
        <Typography variant="h6" noWrap>
          {open ? 'Panel de control' : 'PC'}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
          <Typography variant="h6" display="inline">
            {open && 'Theme'}
            <IconButton onClick={toggleTheme}>
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
                justifyContent: open ? 'initial' : 'center',
                '& .MuiListItemIcon-root': { minWidth: 0, mr: open ? 3 : 'auto' },
                '& .MuiListItemText-root': { opacity: open ? 1 : 0 },
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
