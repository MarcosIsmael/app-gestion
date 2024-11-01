import { Metadata } from 'next';
import React from 'react'
import { SidebarComponent } from '../components/core/SidebarComponent';
import { Box, Paper } from '@mui/material';
interface Props {
  children: React.ReactNode
}
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard description",
};
export default function Layout({ children }: Props) {
  return (
    <Box>

      <SidebarComponent />
      <Box ml={7}  >
        < Box component={Paper} pt={2}>
          {children}
        </Box>
      </Box>
    </Box>


  )
}
