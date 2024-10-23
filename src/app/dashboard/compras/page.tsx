// src/app/dashboard/compras/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Link from 'next/link';

interface Compra {
  id: number;
  proveedor: string;
  fecha: string;
  importeTotal: number;
}

const ComprasPage: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    const fetchCompras = async () => {
      const response = await fetch('/api/compras');
      const data = await response.json();
      setCompras(data);
    };

    fetchCompras();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h6">Proveedor</Typography></TableCell>
            <TableCell><Typography variant="h6">Fecha</Typography></TableCell>
            <TableCell><Typography variant="h6">Importe Total</Typography></TableCell>
            <TableCell><Typography variant="h6">Detalles</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compras.map((compra) => (
            <TableRow key={ JSON.stringify(compra)}>
              <TableCell>{compra.proveedor}</TableCell>
              <TableCell>{new Date(compra.fecha).toLocaleDateString()}</TableCell>
              <TableCell>{Number(compra.importeTotal).toFixed(2)}</TableCell>
              <TableCell>
              <Link href={`/dashboard/compras/detalle/${compra.id}`}>
                  <Typography variant="body2" color="primary" style={{ cursor: 'pointer' }}>
                    Ver Detalles
                  </Typography>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComprasPage;
