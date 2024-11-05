// pages/venta/[id].tsx
import React from 'react';
import { Box, Typography, Divider, Grid, Icon } from '@mui/material';
import axios from 'axios';
import { CheckCircleOutline } from '@mui/icons-material';

type Producto = {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioCompra: string;
  precioFinal: string;
  fotoUrl: string | null; // URL de la imagen del producto
};

type Ingreso = {
  id: number;
  fecha: Date;
  monto: string;
  descripcion: string;
  metodo_de_pago: string;
};

type VentaDetailProps = {
  ingreso: Ingreso;
  productos: Producto[];
};

const VentaDetailPage = async ({ params }: { params: { id: string } }) => {
  const { ingreso, productos }: VentaDetailProps = await axios
    .get(`http://localhost:3000/api/ingresos/${params.id}`)
    .then(({ data }) => data)
    .catch(err => {
      console.error(err);
      return { ingreso: null, productos: [] };
    });

  if (!ingreso) {
    return <Typography variant="h6" color="error">Error al cargar los datos.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
      {/* Primera Sección: Detalles del Ingreso */}
      <Typography variant="h5" gutterBottom>
        Detalle de Ingreso
      </Typography>
      <Box>
        <Typography variant="body1">Fecha: {new Date(ingreso.fecha).toLocaleDateString()}</Typography>
        <Typography variant="body1">Importe: ${ingreso.monto}</Typography>
        <Typography variant="body1">Método de Pago: {ingreso.metodo_de_pago}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Segunda Sección: Lista de Productos */}
      <Typography variant="h6" gutterBottom>
        Productos
      </Typography>
      {productos.map((producto, index) => {
        const ganancia = (parseFloat(producto.precioFinal) - parseFloat(producto.precioCompra)).toFixed(2);
        return (
          <Grid container key={index} spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
            <Grid item xs={3}>
              <Box
                component="img"
                src={producto.fotoUrl || '/placeholder.png'}
                alt={producto.productoNombre}
                sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography variant="subtitle1">{producto.productoNombre}</Typography>
              <Typography variant="body2" color="textSecondary">Cantidad: {producto.cantidad}</Typography>
              <Typography variant="body2" color="textSecondary">Precio Final: ${producto.precioFinal}</Typography>
              <Typography variant="body2" color="success.main" display="flex" alignItems="center">
                <Icon component={CheckCircleOutline} sx={{ mr: 0.5 }} />
                Ganancia: ${ganancia}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

export default VentaDetailPage;
