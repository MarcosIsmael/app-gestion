'use client'
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ButtonBase,
} from '@mui/material';
import CrearMarcaModalComponent from '@/app/components/productos/marcas/CrearMarcaModalComponent';
import CrearTipoProductoModalComponent from '@/app/components/productos/tipos/CrearTipoProductoModalComponent';

const ProductForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [marcaNombre, setMarcaNombre] = useState('');
  const [tipoProducto, setTipoProducto] = useState<string | ''>('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [costo, setCosto] = useState<number | ''>('');
  const [marcas, setMarcas] = useState<{ id: number; nombre: string }[]>([]);
  const [tiposProducto, setTiposProducto] = useState<{ id: number; nombre: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoProductoModalOpen, setTipoProductoModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const handleTipoProductoOpen = () => setTipoProductoModalOpen(true);
  const handleTipoProductoClose = () => setTipoProductoModalOpen(false);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch('/api/marcas');
        if (!response.ok) throw new Error('Error al obtener marcas');
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        setError('Error al cargar las marcas');
      }
    };

    const fetchTiposProducto = async () => {
      try {
        const response = await fetch('/api/tipos-productos');
        if (!response.ok) throw new Error('Error al obtener tipos de producto');
        const data = await response.json();
        setTiposProducto(data);
      } catch (error) {
        setError('Error al cargar los tipos de producto');
      }
    };

    fetchMarcas();
    fetchTiposProducto();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !descripcion || stock === '' || !marcaNombre || tipoProducto === '' || precio === '' || costo === '') {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, descripcion, stock, marca: marcaNombre, tipoProducto, precio, costo }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el producto');
      }

      setSuccess(true);
      // Resetear campos
      setNombre('');
      setDescripcion('');
      setStock('');
      setMarcaNombre('');
      setTipoProducto('');
      setPrecio('');
      setCosto('');
    } catch (error) {
      setError('Error al agregar el producto');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess(false);
  };

  return (
    <Container maxWidth="sm">
      <CrearMarcaModalComponent open={modalOpen} handleClose={handleClose} />
      <CrearTipoProductoModalComponent open={tipoProductoModalOpen} handleClose={handleTipoProductoClose} />
 
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              InputLabelProps={{
                shrink: true, // Esto evitará que el label se mueva
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              InputLabelProps={{
                shrink: true, // Esto evitará que el label se mueva
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              variant="outlined"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              inputProps={{ min: 0 }}
              InputLabelProps={{
                shrink: true, // Esto evitará que el label se mueva
              }}
            />
          </Grid>
          <Grid item xs={12} >

            <Grid container justifyContent={'space-between'} alignItems={'center'} >
              <Grid item xs={9}>
                <FormControl fullWidth variant="outlined" required >
                  <InputLabel id="marca-select-label">Marca</InputLabel>
                  <Select
                    labelId="marca-select-label"
                    value={marcaNombre}
                    onChange={(e) => setMarcaNombre(e.target.value)}
                  >
                    {marcas.map((marca) => (
                      <MenuItem key={marca.id} value={marca.nombre}>
                        {marca.nombre}
                      </MenuItem>
                    ))}
                  </Select>

                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button type='button' variant="contained" size='small' color="primary" onClick={handleOpen}>
                  +
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent={'space-between'} alignItems={'center'} >
              <Grid item xs={9}>

                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="tipo-producto-select-label">Tipo de Producto</InputLabel>
                  <Select
                    labelId="tipo-producto-select-label"
                    value={tipoProducto}
                    onChange={(e) => setTipoProducto(e.target.value)}
                  >
                    {tiposProducto.map((tipo) => (
                      <MenuItem key={JSON.stringify(tipo)} value={tipo.nombre}>
                        {tipo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" size='small' color="primary" onClick={handleTipoProductoOpen} >
                  +
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Precio"
              type="number"
              variant="outlined"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              required
              inputProps={{ min: 0, step: '0.01' }}
              InputLabelProps={{
                shrink: true, // Esto evitará que el label se mueva
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Costo"
              type="number"
              variant="outlined"
              value={costo}
              onChange={(e) => setCosto(Number(e.target.value))}
              required
              inputProps={{ min: 0, step: '0.01' }}
              InputLabelProps={{
                shrink: true, // Esto evitará que el label se mueva
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Agregar Producto
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar para errores */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Snackbar para éxito */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Producto agregado correctamente!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductForm;
