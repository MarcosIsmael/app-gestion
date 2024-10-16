// src/components/CrearTipoProductoModalComponent.tsx

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CrearTipoProductoModalComponent: React.FC<{ open: boolean; handleClose: () => void }> = ({
  open,
  handleClose,
}) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/tipos-productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar el tipo de producto');
      }

      setSuccess(true);
      setNombre('');
      handleClose(); // Cerrar el modal al agregar exitosamente
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Crear Nuevo Tipo de Producto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre del Tipo de Producto"
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar
          </Button>
        </form>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert onClose={() => setSuccess(false)} severity="success">
            Tipo de producto agregado exitosamente
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default CrearTipoProductoModalComponent;
