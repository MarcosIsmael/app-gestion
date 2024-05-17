'use client'

import { Box, TextField, Typography } from "@mui/material"
import { useSearchParams } from 'next/navigation'
import { useLayoutEffect, useState } from "react"
export type PagosParams = { id: string }
export type ProductForm = object
const PagosPage = () => {
  const search = useSearchParams()
  const [productForm, setProductForm] = useState<ProductForm >()

  return (
    <div>Registrar pago
      {search.getAll('cod').map((id, index) => {
        console.log('??', id)
        return (
          <Box m={2} display={'flex'} justifyContent={'center'} gap={2}>
            <TextField key={index + id} disabled variant="outlined" label='Nombre producto' placeholder="Nombre producto" defaultValue={id} />
            {/* <TextField key={index + id + 'cantidad'} value={ productForm[id] ? productForm[id].cantidad : '0'} onChange={(e) => setProductForm({ ...productForm, [id]: { cantidad: Number(e.target.value) } })} variant="outlined" label='Cantidad' placeholder="cantidad" type="number" defaultValue={1} /> */}
          </Box>
        )
      })}
      <Typography>Total $</Typography>

    </div>
  )
}

export default PagosPage