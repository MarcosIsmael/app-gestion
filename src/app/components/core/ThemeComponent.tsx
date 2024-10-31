'use client'
import { DarkTheme } from '@/app/theme/dark'
import { LigthTheme } from '@/app/theme/ligth'
import { Box, Button, ThemeProvider } from '@mui/material'
import React, { useState } from 'react'
type ThemeModeTypes = 'dark' | 'ligth'
export const ThemeComponent = ({children}:{children:React.ReactNode}) => {
    const [toggleTheme, setToggleTheme] = useState<ThemeModeTypes>('ligth')

    return (
        <Box display={'flex'} alignItems={'flex-start'}>
            {toggleTheme === 'dark' ?
                <Button onClick={()=> setToggleTheme('ligth')}> cambiar a ligth</Button>
                :
                <Button onClick={()=> setToggleTheme('dark')}> cambiar a dark</Button>
            }
            <ThemeProvider theme={toggleTheme === 'dark' ? DarkTheme : LigthTheme} >
            {children}
            </ThemeProvider>
            </Box>
    )
}
