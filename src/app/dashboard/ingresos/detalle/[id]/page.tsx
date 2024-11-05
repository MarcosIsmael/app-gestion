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
  precioCompra: string;
};
type Ingreso = {
    id: number,
    fecha: Date,
    monto: string,
    descripcion: string,
    metodo_de_pago: string
}
type VentaDetailProps = {
    ingreso: Ingreso
  productos: Producto[];
};



const VentaDetailPage =async ({ params }: { params: { id: string } }) => {
    const { ingreso, productos }: VentaDetailProps = await axios.get(`http://localhost:3000/api/ingresos/${params.id}`).then(({data}) => data).catch(err => {})

  return (

      <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Detalle de Ingreso
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" color="textSecondary">Fecha: {new Date(ingreso.fecha).toLocaleDateString()}</Typography>
            <Typography variant="body1" color="textSecondary">Importe: ${ingreso.monto}</Typography>
            <Typography variant="body1" color="textSecondary">Método de Pago: {ingreso.metodo_de_pago}</Typography>
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
                  <Typography variant="body2" color="textSecondary">Precio Unitario: ${producto.precioCompra}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

  );
};

export default VentaDetailPage;
