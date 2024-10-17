// pages/productos.tsx
'use client'
import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Producto {
  codigo: number;
  nombre: string;
  stock: number;
}

const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [stockUpdate, setStockUpdate] = useState<{ codigo: number; stock: number }>({
    codigo: 0,
    stock: 0,
  });

  useEffect(() => {
    const fetchProductos = async () => {
      const response = await fetch('/api/productos');
      const data: Producto[] = await response.json();
      setProductos(data);
    };

    fetchProductos();
  }, []);

  const handleUpdateStock = async (codigo: number) => {
    await fetch('/api/productos/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo, stock: stockUpdate.stock }),
    });
    setStockUpdate({ codigo: 0, stock: 0 }); // Reinicia el stock actualizado
    // Refresca la lista de productos
    const response = await fetch('/api/productos');
    const data: Producto[] = await response.json();
    setProductos(data);
  };

  return (
    <Box p={2}>
      <TextField
        label="Buscar producto"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
      />
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos
              .filter((producto) => producto.nombre.toLowerCase().includes(filter.toLowerCase()))
              .map((producto) => (
                <TableRow key={producto.codigo}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={stockUpdate.codigo === producto.codigo ? stockUpdate.stock : producto.stock}
                      onChange={(e) =>
                        setStockUpdate({ codigo: producto.codigo, stock: Number(e.target.value) })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateStock(producto.codigo)}
                    >
                      Actualizar Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductosPage;
