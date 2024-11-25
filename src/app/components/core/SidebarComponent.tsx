'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Home,
  ShoppingCart,
  AttachMoney,
  ShoppingBag,
  Assessment,
  BarChart,
  Settings,
  Login,
  Logout,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeContext } from '@/app/theme/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TrendingDown from '@mui/icons-material/TrendingDown';
import useAuth from '@/hooks/useAuth';

const drawerWidth = 240;

export const SidebarComponent = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, isAuthenticated, logout } = useAuth('ADMIN');
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme, mode } = useThemeContext() as any;
  const [open, setOpen] = useState(false);
  
  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    router.push(path);
  };

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => pathname.includes(item.path));
    if (currentIndex !== -1) {
      setSelectedIndex(currentIndex);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/dashboard/home' },
    { text: 'Productos', icon: <ShoppingCart />, path: '/dashboard/productos' },
    { text: 'Ventas', icon: <AttachMoney />, path: '/dashboard/ventas' },
    { text: 'Compras', icon: <ShoppingBag />, path: '/dashboard/compras' },
    { text: 'Finanzas', icon: <BarChart />, path: '/dashboard/finanzas' },
    { text: 'Ingresos', icon: <AttachMoney />, path: '/dashboard/ingresos' },
    { text: 'Egresos', icon: <TrendingDown />, path: '/dashboard/egresos' },
    { text: 'Estadísticas', icon: <Assessment />, path: '/dashboard/estadisticas' },
    { text: 'Configuración', icon: <Settings />, path: '/dashboard/configuracion' },
  ];

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : 64,
          transition: 'width 0.3s ease',
          boxSizing: 'border-box',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          overflowX: 'hidden',
          // Barra de desplazamiento personalizada
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2a2a2a',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#444444',
            borderRadius: '4px',
            border: '3px solid #2a2a2a',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#757575',
          },
        },
      }}
    >
      <Box sx={{ padding: open ? '16px' : '8px', backgroundColor: '#121212', textAlign: open ? 'left' : 'center' }}>
        <Box height={70} pt={3} pb={3}>
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
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index, item.path)}
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

        {/* Sección de sesión */}
        <Divider />
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => router.push('/profile')}
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  '& .MuiListItemIcon-root': { minWidth: 0, mr: open ? 3 : 'auto' },
                  '& .MuiListItemText-root': { opacity: open ? 1 : 0 },
                }}
              >
                <ListItemIcon>
                  {user ? <Avatar>{user.email[0].toUpperCase()}</Avatar> : <Login />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: open ? 'none' : '140px',
                      }}
                    >
                      {user.email}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ justifyContent: open ? 'initial' : 'center' }}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/login')} sx={{ justifyContent: open ? 'initial' : 'center' }}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Iniciar sesión" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};
