import { Box } from '@mui/material'
import React from 'react'
import { IngresoDelMesComponent } from '../components/dashboard/IngresoDelMesComponent'

const DashboardPage = () => {
  return (
    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} flexWrap={'wrap'} gap={4}>
      <IngresoDelMesComponent/>
      <IngresoDelMesComponent/>
      <IngresoDelMesComponent/>
      <IngresoDelMesComponent/>
    </Box>
  )
}

export default DashboardPage