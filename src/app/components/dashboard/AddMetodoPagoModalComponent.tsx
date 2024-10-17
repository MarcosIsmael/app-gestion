import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

// Estilo del modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const AddMetodoPagoModalComponent = () => {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Función para abrir el modal
  const handleOpen = () => setOpen(true);
  // Función para cerrar el modal
  const handleClose = () => setOpen(false);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    if (!nombre.trim()) {
      setError('El nombre del método de pago es requerido.');
      return;
    }

    try {
      // Hacer la petición POST a tu API para agregar el método de pago
      await axios.post('/api/metodos-pago', { nombre });
      setNombre(''); // Limpiar el campo
      handleClose(); // Cerrar el modal
    } catch (err) {
      console.error('Error al agregar el método de pago:', err);
      setError('Hubo un error al agregar el método de pago. Inténtalo de nuevo.');
    }
  };

  return (
    <div>
      {/* Botón que abre el modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Método de Pago
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Agregar Método de Pago
          </Typography>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre del método de pago"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={!!error}
              helperText={error}
              margin="normal"
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleClose} variant="outlined" color="secondary" sx={{ mr: 2 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddMetodoPagoModalComponent;
