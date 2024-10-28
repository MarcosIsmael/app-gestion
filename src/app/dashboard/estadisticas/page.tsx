// pages/dashboard/estadisticas.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, Button, MenuItem, Select } from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

interface EstadisticasData {
  productoMasVendido: { nombre: string; cantidad: number }[];
  ventasComparativas: { mes: string; ventas: number }[];
  actualizacionesPrecios: { mes: string; actualizaciones: number }[];
  marcaMasVendida: { marca: string; cantidad: number }[];
}

const EstadisticasPage: React.FC = () => {
  const [data, setData] = useState<EstadisticasData | null>(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/estadisticas?mes=${mesSeleccionado}`);
        setData(response.data);
      } catch (error) {
        console.error('Error al cargar las estadísticas:', error);
      }
    };

    fetchData();
  }, [mesSeleccionado]);

  if (!data) return <Typography>Cargando estadísticas...</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Estadísticas
      </Typography>

      <Grid container spacing={3}>
        {/* Selector de mes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Seleccionar Mes</Typography>
            <Select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(Number(e.target.value))}
              fullWidth
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </Paper>
        </Grid>

        {/* Gráfico de Producto más Vendido */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Producto más Vendido</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.productoMasVendido}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Comparativa de Ventas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Comparativa de Ventas</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.ventasComparativas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Actualizaciones de Precios */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Actualizaciones de Precios</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.actualizacionesPrecios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actualizaciones" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Marca Más Vendida */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Marca Más Vendida</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.marcaMasVendida}
                  dataKey="cantidad"
                  nameKey="marca"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {data.marcaMasVendida.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EstadisticasPage;
