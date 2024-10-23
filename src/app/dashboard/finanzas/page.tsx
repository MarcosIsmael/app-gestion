'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';

interface Finanzas {
  id: number;
  fecha: string;
  monto: number;
  descripcion: string;
  ventaId?: number | null; // Opcional para manejar null
  compraId?: number | null; // Opcional para manejar null
}

const FinanzasPage = () => {
  const [finanzas, setFinanzas] = useState<Finanzas[]>([]);
  const [totalIngresos, setTotalIngresos] = useState<number>(0);
  const [totalGastos, setTotalGastos] = useState<number>(0);
  useEffect(() => {
    const fetchFinanzas = async () => {
      const response = await fetch('/api/finanzas');
      const data = await response.json();
      setFinanzas(data);
  
      const ingresos = data
        .filter((item: Finanzas) => item.monto > 0)
        .reduce((acc: number, curr: Finanzas) => acc + (Number(curr.monto) || 0), 0); // Asegurarse de que curr.monto no sea undefined
  
      const gastos = data
        .filter((item: Finanzas) => item.monto < 0)
        .reduce((acc: number, curr: Finanzas) => acc + (Number(curr.monto) || 0), 0); // Asegurarse de que curr.monto no sea undefined
  
      setTotalIngresos(ingresos);
      setTotalGastos(gastos);
    };
  
    fetchFinanzas();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Información de Finanzas
      </Typography>
      <Box marginBottom={4}>
        <Typography variant="h6">Resumen Financiero</Typography>
        <Typography>Ingresos Totales: ${Number(totalIngresos).toFixed(2)}</Typography>
        <Typography>Gastos Totales: ${Math.abs(totalGastos).toFixed(2)}</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>ID Venta</TableCell>
              <TableCell>ID Compra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finanzas.map((finanza) => (
              <TableRow key={finanza.id}>
                <TableCell>{finanza.id}</TableCell>
                <TableCell>{new Date(finanza.fecha).toLocaleDateString()}</TableCell>
                <TableCell>${Number(finanza.monto).toFixed(2)}</TableCell>
                <TableCell>{finanza.descripcion}</TableCell>
                <TableCell>{finanza.ventaId ?? 'N/A'}</TableCell>
                <TableCell>{finanza.compraId ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FinanzasPage;
