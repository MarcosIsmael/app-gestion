// pages/venta/[id].tsx
import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Grid } from '@mui/material';
import axios from 'axios';

type Producto = {
  cantidad: number;
  nombre: string;
  stock: number;
  fecha_ultima_actualizacion: string;
  foto_url: string | null;
  precio: string;
};

type VentaDetailProps = {
  fecha: string;
  importe: string;
  tipo_pago: number;
  productos: Producto[];
};



const VentaDetailPage =async ({ params }: { params: { id: string } }) => {
    const { fecha, importe,tipo_pago, productos }: VentaDetailProps = await axios.get(`http://localhost:3000/api/ventas/detalle/${params.id}`).then(({data}) => data).catch(err => {})

  return (

      <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Detalle de la Venta
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" color="textSecondary">Fecha: {new Date(fecha).toLocaleDateString()}</Typography>
            <Typography variant="body1" color="textSecondary">Importe: ${importe}</Typography>
            <Typography variant="body1" color="textSecondary">Método de Pago: {tipo_pago}</Typography>
          </CardContent>
        </Card>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom>Productos</Typography>
        {productos.map((producto, index) => (
          <Card key={index} sx={{ mb: 2, backgroundColor:'background.paper',  }} elevation={4}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box 
                    component="img"
                    src={producto.foto_url || '/placeholder.png'}
                    alt={producto.nombre}
                    sx={{ width: '100%', height: 'auto' }}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">{producto.nombre}</Typography>
                  <Typography variant="body2" color="textSecondary">Cantidad: {producto.cantidad}</Typography>
                  <Typography variant="body2" color="textSecondary">Precio Unitario: ${producto.precio}</Typography>
                  <Typography variant="body2" color="textSecondary">Stock Disponible: {producto.stock}</Typography>
                  <Typography variant="body2" color="textSecondary">Última Actualización: {new Date(producto.fecha_ultima_actualizacion).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

  );
};

export default VentaDetailPage;
