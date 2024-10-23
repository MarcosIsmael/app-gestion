'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider } from '@mui/material';
import { CurrencyExchange, Storefront, Event } from '@mui/icons-material';

const DetalleCompra = () => {
  const [compra, setCompra] = useState<any>(null); // Cambiar el tipo 'any' por el adecuado
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCompra = async () => {
        try {
          const response = await fetch(`/api/compras/detalle/${id}`);
          if (!response.ok) {
            throw new Error('Error al obtener la compra');
          }
          const data = await response.json();
          setCompra(data);
        } catch (error) {
          console.error('Error fetching compra:', error);
        }
      };
      fetchCompra();
    }
  }, [id]);

  if (!compra) return <Typography variant="h6">Cargando...</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Detalles de la Compra
      </Typography>
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Storefront sx={{ marginRight: 1 }} /> Proveedor: {compra.compra.proveedorNombre}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Event sx={{ marginRight: 1 }} /> Fecha: {new Date(compra.compra.fecha).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CurrencyExchange sx={{ marginRight: 1 }} /> Importe Total: ${compra.compra.importeTotal}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Productos en la Compra
      </Typography>
      <Grid container spacing={2}>
        {compra.productos.map((producto: any) => (
          <Grid item xs={12} sm={6} md={4} key={producto.productoId}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Producto: {producto.productoNombre}
                </Typography>
                <Divider />
                <Typography variant="body1">
                  Cantidad: {producto.cantidad}
                </Typography>
                <Typography variant="body1">
                  Precio de Compra: ${producto.precioCompra}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Subtotal: ${producto.cantidad * producto.precioCompra}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DetalleCompra;
