'use client'
import { Box, Button, MenuItem, Select, TextField, Typography, InputLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddProveedorModalComponent from '../../../components/dashboard/AddProveedorModalComponent';

interface Proveedor {
    id: number;
    nombre: string;
}

interface Producto {
    codigo: number;
    nombre: string;
}

interface CompraProducto {
    productoId: number;
    cantidad: number;
    precioCompra: number;
}

const NuevaCompraForm = () => {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [compra, setCompra] = useState({
        proveedorId: '',
        fecha: '',
        importeTotal: '',
    });
    const [compraProductos, setCompraProductos] = useState<CompraProducto[]>([
        { productoId: 0, cantidad: 0, precioCompra: 0 },
    ]);

    useEffect(() => {
        // Cargar proveedores
        axios.get('/api/proveedores').then((res) => {
            setProveedores(res.data);
        });

        // Cargar productos
        axios.get('/api/productos').then((res) => {
            setProductos(res.data);
        });
    }, []);

    const handleChangeCompra = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompra({ ...compra, [name]: value });
    };

    const handleChangeCompraProducto = (index: number, field: string, value: number) => {
        const updatedCompraProductos = [...compraProductos];
        updatedCompraProductos[index] = { ...updatedCompraProductos[index], [field]: value };
        setCompraProductos(updatedCompraProductos);
    };

    const handleAddProducto = () => {
        setCompraProductos([...compraProductos, { productoId: 0, cantidad: 0, precioCompra: 0 }]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('/api/compras', {
                ...compra,
                compraProductos,
            });
            alert('Compra registrada exitosamente');
        } catch (error) {
            console.error('Error al registrar la compra', error);
            alert('Error al registrar la compra');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Registrar Nueva Compra
            </Typography>
            <Box display={'flex'}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="proveedor-label">Proveedor</InputLabel>
                    <Select
                        labelId="proveedor-label"
                        id="proveedorId"
                        name="proveedorId"
                        value={compra.proveedorId}
                        label="Proveedor"
                        onChange={(e) => setCompra({ ...compra, proveedorId: e.target.value })}
                    >
                        {proveedores.map((proveedor) => (
                            <MenuItem key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <AddProveedorModalComponent/>
            </Box>

            <TextField
                label="Fecha"
                type="date"
                name="fecha"
                value={compra.fecha}
                onChange={handleChangeCompra}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
            />

            <TextField
                label="Importe Total"
                type="number"
                name="importeTotal"
                value={compra.importeTotal}
                onChange={handleChangeCompra}
                fullWidth
                margin="normal"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Productos en la Compra
            </Typography>

            {compraProductos.map((cp, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id={`producto-label-${index}`}>Producto</InputLabel>
                        <Select
                            labelId={`producto-label-${index}`}
                            value={cp.productoId}
                            onChange={(e) => handleChangeCompraProducto(index, 'productoId', Number(e.target.value))}
                            label="Producto"
                        >
                            {productos.map((producto) => (
                                <MenuItem key={producto.codigo} value={producto.codigo}>
                                    {producto.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Cantidad"
                        type="number"
                        value={cp.cantidad}
                        onChange={(e) => handleChangeCompraProducto(index, 'cantidad', Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        label="Precio de Compra"
                        type="number"
                        value={cp.precioCompra}
                        onChange={(e) => handleChangeCompraProducto(index, 'precioCompra', Number(e.target.value))}
                        fullWidth
                    />
                </Box>
            ))}

            <Button variant="contained" color="primary" onClick={handleAddProducto}>
                Agregar Producto
            </Button>

            <Button type="submit" variant="contained" color="success" sx={{ mt: 3 }}>
                Registrar Compra
            </Button>
        </Box>
    );
};

export default NuevaCompraForm;
