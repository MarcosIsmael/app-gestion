'use client'
import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
// import {  useRouter } from 'next/router';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const EditarProducto: React.FC = () => {
  const { id } = useParams(); // Obtener el id del producto desde la URL
  const router = useRouter()
  const [producto, setProducto] = useState<any>({
    nombre: '',
    descripcion: '',
    stock: 0,
    precio: {
      precio: 0,
      costo: 0,
    },
    fecha_inicio: '',
    fecha_fin: '',
    fecha_ultima_actualizacion: '',
    foto_url:null
  });

  useEffect(() => {
    const fetchProducto = async () => {
      if (id) {
        const response = await fetch(`/api/productos/${id}`);
        const data = await response.json();
        setProducto({
          ...data,
          precio: {
            precio: data.precio,
            costo: data.costo,
          },
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
        });
      }
    };

    fetchProducto();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('precio')) {
      setProducto((prev:any) => ({
        ...prev,
        precio: {
          ...prev.precio,
          [name.split('.')[1]]: Number(value),
        },
      }));
    } else {
      setProducto((prev : any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        stock: producto.stock,
        precio: {
          precio: producto.precio.precio,
          costo: producto.precio.costo,
        },
        productoId: id,
        precioId: producto.precioId,
        fecha_inicio: producto.fecha_inicio,
        fecha_fin: producto.fecha_fin,
        fecha_ultima_actualizacion: new Date().toISOString(),
      }),
    });

    // Redirigir a la página de productos después de actualizar
    router.push('/dashboard/productos');
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Editar Producto
      </Typography>
      <form onSubmit={handleSubmit}>
        <Image src={producto.foto_url || ''} alt='Foto de producto' width={500} height={500} ></Image>
        <TextField
          label="Nombre"
          variant="outlined"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Descripción"
          variant="outlined"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          type="number"
          label="Stock"
          variant="outlined"
          name="stock"
          value={producto.stock}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          type="number"
          label="Precio"
          variant="outlined"
          name="precio.precio"
          value={producto.precio.precio}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          type="number"
          label="Costo"
          variant="outlined"
          name="precio.costo"
          value={producto.precio.costo}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        {/* <TextField
          type="date"
          label="Fecha de Inicio"
          variant="outlined"
          name="fecha_inicio"
          value={producto.fecha_inicio.split('T')[0]} // Formato correcto para el input de tipo date
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          type="date"
          label="Fecha de Fin"
          variant="outlined"
          name="fecha_fin"
          value={producto.fecha_fin.split('T')[0]} // Formato correcto para el input de tipo date
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        /> */}
        <Button type="submit" variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </form>
    </Box>
  );
};

export default EditarProducto;
