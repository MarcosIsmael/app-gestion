'use client'

import { Autocomplete, Box,  IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import { useSearchParams } from 'next/navigation'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Suspense, useLayoutEffect, useState } from "react"
export type PagosParams = { id: string }
export type ProductForm = object

export type Producto = {
  label: string,
  cod: number,
  precio: number
  cantidad: number
}
const opcionesProductos = [
  { label: 'Babysec G x 60', cod: 1, precio: 13000 },
  { label: 'Babysec M x 68', cod: 2, precio: 13500 },
  { label: 'Babysec XG x 52', cod: 3, precio: 14000 },

]

export default function PagosPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Pagos />
    </Suspense>
  );
}

const Pagos = () => {
  const search = useSearchParams()
  const [productos, setProductos] = useState<Producto[]>([])
  const [estimadoTotal, setEstimadoTotal] = useState(0)
  useLayoutEffect(() => {
    //LLamada a la api o db para obtener la informacion completa del producto recibido por url
    let productosMarcados: Producto[] = []
    search.getAll('cod').forEach(p => {
      const productoDB = opcionesProductos.find(pr => pr.cod === Number(p))
      if (productoDB) productosMarcados.push({ ...productoDB, cantidad: 1 })
    })
    setProductos(productosMarcados)
    setEstimadoTotal(productosMarcados.reduce((acc, producto) => {
      return acc + producto.precio;
    }, 0))
  }, [])

  return (
    <div>
      <Typography>Registrar Pago</Typography>
      <Typography component={'span'}> Tenes {search.getAll('cod').length} productos marcados</Typography>
      <Box display={'flex'} flexDirection={'column'} width={'80%'} m={'auto'}>
        <Box display={'flex'} justifyContent={'space-around'}>
          <Autocomplete
            clearOnEscape
            disablePortal
            getOptionDisabled={(opcion) => Boolean(productos.find(p => p.cod === opcion.cod))}
            loading={true}
            id="autocomplete-registrar-pago-productos"
            options={opcionesProductos}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Búsca un producto" />}
            onChange={(e, value) => {
              if (value) setProductos([...productos, { ...value, cantidad: 1 }])
            }}
          />
          <Box component={'span'}>
            Total estimado: {estimadoTotal}
          </Box>
        </Box>
        <List dense >
          {productos.map((producto, index) => (
            <ListItem key={producto.cod + index+'k'}
              secondaryAction={
                <Box display={'flex'} gap={2} flexDirection={'row'}>
                  <IconButton edge="end" aria-label="agregar" onClick={() => { 
                    setProductos(productos.map(p => p.cod == producto.cod ? { ...p, cantidad: p.cantidad + 1 } : p)) 
                    setEstimadoTotal(estimadoTotal + producto.precio)
                  }} >
                    <AddIcon />
                  </IconButton>
                  <Box alignContent={'center'}>
                    {producto.cantidad}
                  </Box>
                  <IconButton edge="end" aria-label="remover" 
                  onClick={() => {
                    setProductos(productos.map(p => p.cod == producto.cod && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p))
                    setEstimadoTotal(estimadoTotal - producto.precio)
                  }}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="borrar" 
                  onClick={() => {
                    setProductos(productos.filter(p => p.cod !== producto.cod))
                    setEstimadoTotal(estimadoTotal - (producto.precio * producto.cantidad))
                    }}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={producto.label} secondary={`Precio $${producto.precio}`} />
            </ListItem>
          ))}


        </List>

      </Box>

    </div>
  )
}

