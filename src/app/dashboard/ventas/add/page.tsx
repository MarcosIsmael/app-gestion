'use client';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Autocomplete,
  Grid,
  IconButton,
  Container,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddMetodoPagoModalComponent from '@/app/components/dashboard/AddMetodoPagoModalComponent';

// Tipos para los productos y métodos de pago

interface Producto {
  codigo: string;
  descripcion: string;
  nombre: string;
  stock: number;
  marca_tipo: number;
  foto_url: string;
  precio: string; // Asegúrate de que este campo sea tipo string o número, dependiendo de la estructura de tu API
  costo: string;
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
  const [importe, setImporte] = useState<string>('0');

  // Obtener productos y métodos de pago desde la base de datos
  useEffect(() => {
    const fetchProductosYMetodos = async () => {
      try {
        const productosRes = await axios.get('/api/productos');
        const metodosPagoRes = await axios.get('/api/metodos-pago');
        setProductos(productosRes.data);
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
    actualizarImporte(newProductos); // Actualizar el importe total al seleccionar un producto
  };

  // Validar y actualizar cantidad
  const handleCantidadChange = (index: number, cantidad: number) => {
    const productoSeleccionado = productos.find(
      (prod) => prod.codigo === selectedProductos[index].productoId
    );

    if (productoSeleccionado && cantidad > productoSeleccionado.stock) {
      alert(
        `No puedes agregar más de ${productoSeleccionado.stock} unidades de este producto.`
      );
      return;
    }

    handleProductoChange(index, 'cantidad', cantidad);
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
    actualizarImporte(newProductos); // Actualizar el importe total al eliminar un producto
  };

  // Función para calcular el importe total
  const actualizarImporte = (productosSeleccionados: ProductoVenta[]) => {
    let total = 0;

    productosSeleccionados.forEach((producto) => {
      const productoSeleccionado = productos.find(
        (prod) => prod.codigo === producto.productoId
      );
      if (productoSeleccionado) {
        total += parseFloat(productoSeleccionado.precio) * producto.cantidad;
      }
    });

    setImporte(total.toFixed(2)); // Redondear el total a 2 decimales
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

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Registro de venta
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {selectedProductos.map((producto, index) => (
            <React.Fragment key={producto.productoId || `temp-${index}`}>
              <Grid item xs={12} sm={5}>
                <Autocomplete
                  options={productos.filter(
                    (prod) =>
                      !selectedProductos.some(
                        (selProd) => selProd.productoId === prod.codigo
                      )
                  )}
                  getOptionLabel={(option) =>
                    `${option.nombre} (${option.stock} disponibles)`
                  }
                  value={productos.find((prod) => prod.codigo === producto.productoId) || null}
                  onChange={(e, value) =>
                    handleProductoChange(index, 'productoId', value ? value.codigo : '')
                  }
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      key={option.codigo + 600}
                      style={{
                        pointerEvents: option.stock === 0 ? 'none' : 'auto',
                        opacity: option.stock === 0 ? 0.5 : 1,
                      }}
                    >
                      {option.nombre} ({option.stock} disponibles)
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Producto" required />}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) =>
                    handleCantidadChange(index, parseInt(e.target.value, 10) || 0)
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
            <Box display="flex" alignItems="center" gap={2} width={'100%'}>
              <Autocomplete
                fullWidth
                options={metodosPago}
                getOptionLabel={(option) => option.nombre}
                value={metodosPago.find((metodo) => metodo.id === metodoPagoId) || null}
                onChange={(e, value) => setMetodoPagoId(value ? value.id : '')}
                renderInput={(params) => (
                  <TextField {...params} label="Método de Pago" required fullWidth />
                )}
              />
              <AddMetodoPagoModalComponent />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Importe Total"
              type="number"
              value={importe}
              onChange={(e) => setImporte(e.target.value)}
              required
              fullWidth
              InputProps={{
                readOnly: true, // Solo lectura para el importe
              }}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Registrar Venta
        </Button>
      </form>
    </Container>
  );
};

export default RegistrarVentaForm;
