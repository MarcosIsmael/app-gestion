// src/pages/Ventas.tsx
'use client'
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box,
  Grid,
  Button,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AddIngresoModalComponent } from '@/app/components/dashboard/AddIngresoModalComponent';
import { TotalComponent } from '@/app/components/dashboard/TotalComponent';
import { AcumuladoGraficoComponent } from '@/app/components/dashboard/AcumuladoGraficoComponent';

// Tipos para la estructura de datos
interface Ingreso {
  id: number;
  fecha: string;
  monto: number;
  descripcion:string;
  metodo_de_pago: string;
}


const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()
  // Obtener ventas del mes corriente desde la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('/api/ingresos');
        const data: Ingreso[] = await response.json();
        setVentas(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);


  return (
    <Container >
      <Grid container display={'flex'} alignItems={'center'} >
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>
            Registro de Ingresos
          </Typography>

        </Grid>
        <Grid item xs={6} display={'flex'} gap={1} flexDirection={'row'}>
            <AddIngresoModalComponent/>
          <Link href={'/dashboard/ventas/add'} >
            <Button color='primary' variant='contained'>
              Agregar registro de ventas
            </Button>
          </Link>
        </Grid>
      </Grid>
      <TotalComponent total={400} />
      <AcumuladoGraficoComponent/>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mt={4}>
            <Typography variant="h6">Historial de Ingresos</Typography>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell>Fecha</TableCell>
                  <TableCell>Importe</TableCell>
                  <TableCell>Método de Pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map((ingreso) => (
                      <TableRow
                      key={ingreso.id}
                      onClick={() => router.push(`/dashboard/ingresos/detalle/${ingreso.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                    <TableCell>{new Date(ingreso.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(ingreso.monto).toFixed(2)}</TableCell>
                    <TableCell>{ingreso.metodo_de_pago}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Ventas;
