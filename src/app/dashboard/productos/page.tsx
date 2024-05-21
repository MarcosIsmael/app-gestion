'use client'
import { TarjetaProductoComponent } from '@/app/components/productos'
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

 export type ProductCat = {
  id: number,
  name:string
}
const opcionesProductos = [
  { label: 'Babysec G x 60', cod: 1, precio: 13000, cantidad:4 },
  { label: 'Babysec M x 68', cod: 2, precio: 13500, cantidad:40 },
  { label: 'Babysec XG x 52', cod: 3, precio: 14000, cantidad:10 },

]
const ProductosPage = () => {
const [cart, setCart] = useState<ProductCat[]>([])
const router = useRouter()

const handleProductCart = (product:ProductCat)=>{
if(!cart.find( p => p.id === product.id)){
  setCart([...cart,product])
}else setCart(cart.filter(p => p.id !== product.id))
}
  return (
    <div>
      {cart.length > 0 ? 
      <Box display={'flex'} width={'100%'} justifyContent={'flex-end'} alignItems={'center'}>
        <Typography color={'error'}> Registrar un pago para {cart?.length} productos </Typography>  
      <Button color='error' variant='contained' onClick={()=> router.push(`/dashboard/pagos?cod=${cart.map(p => p.id).join('&cod=')}`,)}>Registrar {cart.length}</Button>
      </Box> : null
    }
      <Typography variant='h3'> Productos</Typography>
      <Box display={'flex'} justifyContent={'flex-start'} flexWrap={'wrap'} gap={4} p={1}>
       {opcionesProductos.map(v => 
        (
          <TarjetaProductoComponent producto={v} handleCheck={handleProductCart} />
        )
       )}
      </Box>

    </div>
  )
}

export default ProductosPage