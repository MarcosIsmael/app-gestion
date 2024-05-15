import { Box } from '@mui/material'
import React from 'react'
import { IngresoDelMesComponent } from '../components/dashboard/IngresoDelMesComponent'

const DashboardPage = () => {
  return (
    <Box display={'flex'}>
      <IngresoDelMesComponent/>
    </Box>
  )
}

export default DashboardPage