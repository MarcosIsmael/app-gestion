import { Metadata } from 'next';
import React from 'react'
import { SidebarComponent } from '../components/core/SidebarComponent';
import { Paper } from '@mui/material';
interface Props {
    children: React.ReactNode
}
export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard description",
  };
export default function Layout({children}:Props) {
  return (
  
    <Paper>
    <SidebarComponent/>

    {children}
    
    </Paper>
    
  )
}
