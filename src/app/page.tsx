'use client'
import React from 'react';
import { Box, Button, Container, Typography, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';


const HomePage: React.FC = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestión de Comercios
          </Typography>
          <Button color="inherit" onClick={handleNavigate}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido a Gestión de Comercios
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Simplifica y optimiza la administración de tu negocio con nuestra aplicación de gestión de comercios.
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button variant="contained" color="primary" size="large" onClick={handleNavigate}>
            Acceder al Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
