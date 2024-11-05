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
import { AcumuladoGraficoComponent } from '@/app/components/dashboard/AcumuladoGraficoComponent';
import { TotalComponent } from '@/app/components/dashboard/TotalComponent';

// Tipos para la estructura de datos
interface Ingreso {
  id: number;
  fecha: string;
  monto: number;
  descripcion: string;
  metodo_de_pago: string;
}


const Egresos: React.FC = () => {
  const [ventas, setVentas] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()
  // Obtener ventas del mes corriente desde la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('/api/egresos');
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
            Registro de Egresos
          </Typography>

        </Grid>
        <Grid item xs={6} display={'flex'} gap={1} flexDirection={'row'}>
          <AddIngresoModalComponent />
          <Link href={'/dashboard/ventas/add'} >
            <Button color='primary' variant='contained'>
              Agregar registro de Egresos
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container justifyContent={'space-between'}>
        <Grid item xs={3}>
          <TotalComponent total={ventas.reduce((acumulado, data) => {
            return acumulado + Number(data.monto);
          }, 0)} titulo='Total de Egresos' />
        </Grid>
        <Grid item xs={8} >
          <AcumuladoGraficoComponent data={ventas.map((ingreso) => ({
            name: new Date(ingreso.fecha).toLocaleDateString('es-ES', {
              month: 'short',
            }),
            monto: ingreso.monto
          }))} />
        </Grid>
      </Grid>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mt={4}>
            <Typography variant="h6">Historial de Egresos</Typography>
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

export default Egresos;
