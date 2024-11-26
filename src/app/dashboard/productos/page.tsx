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
import CrearMarcaModalComponent from '@/app/components/productos/marcas/CrearMarcaModalComponent';
import CrearTipoProductoModalComponent from '@/app/components/productos/tipos/CrearTipoProductoModalComponent';
import Image from 'next/image';

interface Producto {
  codigo: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  foto_url: null | string;
}

const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoProductoModalOpen, setTipoProductoModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      const response = await fetch('/api/productos');
      const data: Producto[] = await response.json();
      setProductos(data);
    };

    fetchProductos();
  }, []);

  const handleDelete = async (codigo: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      const response = await fetch(`/api/productos/${codigo}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProductos((prev) => prev.filter((producto) => producto.codigo !== codigo));
      } else {
        console.error('Error al eliminar el producto');
      }
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const handleTipoProductoOpen = () => setTipoProductoModalOpen(true);
  const handleTipoProductoClose = () => setTipoProductoModalOpen(false);

  return (
    <Box p={2}>
      <CrearMarcaModalComponent open={modalOpen} handleClose={handleClose} />
      <CrearTipoProductoModalComponent open={tipoProductoModalOpen} handleClose={handleTipoProductoClose} />

      <Grid container mb={2}>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>
            Productos
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Button color="primary" size="small" variant="outlined" onClick={handleOpen}>
            Nueva marca
          </Button>
          <Button color="primary" size="small" variant="outlined" onClick={handleTipoProductoOpen}>
            Nuevo tipo
          </Button>
          <Link href={'/dashboard/productos/add'}>
            <Button color="primary" size="small" variant="outlined">
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
        sx={{ marginBottom: 2 }}
      />

      {/* Contenedor con scroll */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: '400px', // Altura máxima del contenedor para el scroll
          overflowY: 'auto', // Activar scroll vertical
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2a2a2a',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#444444',
            borderRadius: '4px',
            border: '3px solid #2a2a2a',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#757575',
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
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
                  <TableCell>
                    {producto.foto_url !== null && (
                      <Image src={producto.foto_url} alt="Foto de producto" width={50} height={50} />
                    )}
                  </TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
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
