// AddIngresoComponent.tsx

import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

export const AddIngresoModalComponent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [metodo_pago_id, setMetodoPagoId] = useState('');
  const [metodosPago, setMetodosPago] = useState<any[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/finanzas/addIngreso', {
        fecha,
        monto,
        descripcion,
        metodo_pago_id,
      });
      console.log(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al agregar ingreso:', error);
    }
  };

  useEffect(() => {
    const fetchMetodosPago = async () => {
      try {
        const response = await axios.get('/api/metodos-pago');
        setMetodosPago(response.data); // Asumiendo que la respuesta es un array de métodos de pago
      } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
      }
    };

    fetchMetodosPago();
  }, []);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Agregar Ingreso
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Ingreso</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Fecha"
              type="date"
              fullWidth
              variant="outlined"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Monto"
              type="number"
              fullWidth
              variant="outlined"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Descripción"
              fullWidth
              variant="outlined"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="metodo-pago-label">Método de Pago</InputLabel>
              <Select
                labelId="metodo-pago-label"
                value={metodo_pago_id}
                onChange={(e) => setMetodoPagoId(e.target.value)}
                label="Método de Pago"
              >
                {metodosPago.map((metodo) => (
                  <MenuItem key={metodo.id} value={metodo.id}>
                    {metodo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

