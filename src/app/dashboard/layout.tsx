import { Metadata } from 'next';
import React from 'react'
import { SidebarComponent } from '../components/core/SidebarComponent';
interface Props {
    children: React.ReactNode
}
export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard description",
  };
export default function Layout({children}:Props) {
  return (
    <SidebarComponent>
    
        {children}</SidebarComponent>
  )
}
