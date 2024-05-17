import { Box, Button, Paper, Typography, } from '@mui/material'
import React from 'react'
import Image from "next/image";

export const IngresoDelMesComponent = () => {
  return (
    <Paper elevation={4} >
      <Box width={334} display={'flex'} justifyContent={'center'} flexDirection={'column'} p={3} minHeight={180}>
        <Typography variant='h6'>Felicitaciones Estrella 🎉</Typography>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Box>
            <Typography variant='body2'>Vendedora del mes</Typography>
            <Typography variant='h6'>$ 123000,12</Typography>
            <Box mt={2}>
            <Button variant='contained'>Ver ventas</Button>
            </Box>
          </Box>
          <Box>
            <Image src={'/trofeo.png'} alt='trofeo' width={75} height={98} />
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
