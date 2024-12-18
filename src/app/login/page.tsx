// src/components/Auth/LoginForm.tsx
'use client'
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography,  Box } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ContainerComponent } from '../components/core/ContainerComponent';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Para indicar que estamos esperando la respuesta
  const router = useRouter()
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard/home';
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const userData = { email, password }
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        // Redirigir a otra página (por ejemplo, al login o al dashboard)
        console.log('redirigir')
        router.push(redirectUrl)
        // router.push('/dashboard/home
      } else {
        setError(data.message || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error(error);
      setError('Ocurrió un error al enviar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
      <ContainerComponent boxProps={{width:'50%'}}>
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" color={'primary'} gutterBottom>
          Iniciar sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Correo electrónico"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </Button>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center" color={'primary'}>
                ¿No tienes cuenta?
                <Link href="/register" passHref>
                  <Button color="primary">Regístrate</Button>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
      </ContainerComponent>
  );
};

export default LoginForm;
