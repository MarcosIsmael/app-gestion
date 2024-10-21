'use client'
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Container,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddMetodoPagoModalComponent from '@/app/components/dashboard/AddMetodoPagoModalComponent';

// Tipos para los productos y métodos de pago
interface Producto {
  codigo: string;
  nombre: string;
}

interface MetodoPago {
  id: string;
  nombre: string;
}

interface ProductoVenta {
  productoId: string;
  cantidad: number;
}

const RegistrarVentaForm: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [selectedProductos, setSelectedProductos] = useState<ProductoVenta[]>([
    { productoId: '', cantidad: 1 },
  ]);
  const [metodoPagoId, setMetodoPagoId] = useState<string>('');
  const [importe, setImporte] = useState<string>('');

  // Obtener productos y métodos de pago desde la base de datos
  useEffect(() => {
    const fetchProductosYMetodos = async () => {
      try {
        const productosRes = await axios.get('/api/productos');
        const metodosPagoRes = await axios.get('/api/metodos-pago');
        setProductos(productosRes.data);
        console.log('productos resp', productosRes.data)
        setMetodosPago(metodosPagoRes.data);
      } catch (error) {
        console.error('Error al obtener productos y métodos de pago:', error);
      }
    };
    fetchProductosYMetodos();
  }, []);

  // Manejar la selección de productos
  const handleProductoChange = (index: number, field: string, value: any) => {
    const newProductos = [...selectedProductos];
    newProductos[index] = { ...newProductos[index], [field]: value };
    setSelectedProductos(newProductos);
  };

  // Agregar un nuevo producto
  const agregarProducto = () => {
    setSelectedProductos([...selectedProductos, { productoId: '', cantidad: 1 }]);
  };

  // Eliminar un producto
  const eliminarProducto = (index: number) => {
    const newProductos = [...selectedProductos];
    newProductos.splice(index, 1);
    setSelectedProductos(newProductos);
  };

  // Enviar los datos del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/ventas', {
        productos: selectedProductos,
        metodoPagoId,
        importe,
      });
      alert('Venta registrada correctamente.');
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      alert('Hubo un error al registrar la venta.');
    }
  };
console.log('productos',productos)
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Registro de venta
      </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {selectedProductos.map((producto, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>Producto</InputLabel>
                    <Select
                      value={producto.productoId}
                      onChange={(e) =>
                        handleProductoChange(index, 'productoId', e.target.value)
                      }
                      required
                    >
                      {productos.map((prod) => (
                        <MenuItem key={JSON.stringify(prod)} value={prod.codigo}>
                          {prod.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleProductoChange(index, 'cantidad', parseInt(e.target.value, 10))
                    }
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton onClick={() => eliminarProducto(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button onClick={agregarProducto} variant="outlined">
                Agregar Producto
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={metodoPagoId}
                  onChange={(e) => setMetodoPagoId(e.target.value as string)}
                  required
                >
                  {metodosPago.map((metodo) => (
                    <MenuItem key={metodo.id} value={metodo.id}>
                      {metodo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <AddMetodoPagoModalComponent/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Importe Total"
                type="number"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                required
                fullWidth
              />
            </Grid>
          </Grid>
        <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
          Registrar Venta
        </Button>
        </form>

    </Container>
  );
};

export default RegistrarVentaForm;
