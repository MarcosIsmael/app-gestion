'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import Link from 'next/link';

interface Producto {
  codigo: number;
  nombre: string;
  descripcion: string;
  fecha_ultima_actualizacion: string; // Cambié el tipo para reflejar la fecha
  stock: number;
}

const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchProductos = async () => {
      const response = await fetch('/api/productos');
      const data: Producto[] = await response.json();
      setProductos(data);
    };

    fetchProductos();
  }, []);

  const handleDelete = async (codigo: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      const response = await fetch(`/api/productos/${codigo}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Refresca la lista de productos después de eliminar
        setProductos((prev) => prev.filter((producto) => producto.codigo !== codigo));
      } else {
        console.error("Error al eliminar el producto");
      }
    }
  };

  return (
    <Box p={2}>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>
            Productos
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Link href={'/dashboard/productos/add'}>
            <Button color='primary'>
              Agregar Producto
            </Button>
          </Link>
        </Grid>
      </Grid>
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
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha Última Actualización</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell> {/* Nueva columna para acciones */}
            </TableRow>
          </TableHead>
          <TableBody>
            {productos
              .filter((producto) => producto.nombre.toLowerCase().includes(filter.toLowerCase()))
              .map((producto) => (
                <TableRow
                  key={producto.codigo}
                  onClick={() => (window.location.href = `/dashboard/productos/${producto.codigo}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>{new Date(producto.fecha_ultima_actualizacion).toLocaleDateString()}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que la fila se seleccione al hacer clic en el botón
                        handleDelete(producto.codigo);
                      }}
                    >
                      Eliminar
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
