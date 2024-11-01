// src/pages/Ventas.tsx
'use client'
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box,
  Grid,
  Button,
} from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Tipos para la estructura de datos
interface Venta {
  id: number;
  fecha: string;
  importe: number;
  metodo_pago: string;
}

interface VentasChartData {
  labels: string[];
  data: number[];
}

const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<VentasChartData>({ labels: [], data: [] });
  const router = useRouter()
  // Obtener ventas del mes corriente desde la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('/api/ventas');
        const data: Venta[] = await response.json();
        setVentas(data);
        setLoading(false);

        // Preparar los datos para el gráfico
        const labels = data.map((venta) => new Date(venta.fecha).toLocaleDateString());
        const importes = data.map((venta) => venta.importe);
        setChartData({ labels, data: importes });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Ventas del Mes Corriente' },
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Importe de Ventas',
        data: chartData.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Container >
      <Grid container >
        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>
            Registro de ventas
          </Typography>

        </Grid>
        <Grid item xs={4}>
          <Link href={'/dashboard/ventas/add'} >
            <Button color='primary' variant='contained'>
              Agregar registro de ventas
            </Button>
          </Link>
        </Grid>
      </Grid>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mt={4}>
            <Typography variant="h6">Gráfico de Ventas</Typography>
            <Line options={options} data={data} />
          </Box>

          <Box mt={4}>
            <Typography variant="h6">Historial de Ventas</Typography>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Importe</TableCell>
                  <TableCell>Método de Pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map((venta) => (
                      <TableRow
                      key={venta.id}
                      onClick={() => router.push(`/dashboard/ventas/detalle/${venta.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                    <TableCell>{venta.id}</TableCell>
                    <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(venta.importe).toFixed(2)}</TableCell>
                    <TableCell>{venta.metodo_pago}</TableCell>
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
