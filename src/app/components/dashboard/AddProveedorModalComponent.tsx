import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Alert } from '@mui/material';

interface Proveedor {
  nombre: string;
  direccion: string;
  telefono: string;
  celular: string;
}

const AddProveedorModalComponent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [proveedor, setProveedor] = useState<Proveedor>({
    nombre: '',
    direccion: '',
    telefono: '',
    celular: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  const handleSubmit = async () => {
    // Validación de los campos
    if (!proveedor.nombre || !proveedor.direccion || !proveedor.telefono || !proveedor.celular) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError(null); // Resetea los errores si todo está bien
    try {
      const response = await fetch('/api/proveedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor),
      });

      if (response.ok) {
        // Resetear el formulario si todo fue exitoso
        setProveedor({ nombre: '', direccion: '', telefono: '', celular: '' });
        setOpen(false);
      } else {
        setError('Error al agregar el proveedor');
      }
    } catch (err) {
      setError('Hubo un problema al conectar con el servidor');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Crear nuevo proveedor
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            fullWidth
            value={proveedor.nombre}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            label="Dirección"
            name="direccion"
            fullWidth
            value={proveedor.direccion}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            label="Teléfono"
            name="telefono"
            fullWidth
            value={proveedor.telefono}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            label="Celular"
            name="celular"
            fullWidth
            value={proveedor.celular}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddProveedorModalComponent;
