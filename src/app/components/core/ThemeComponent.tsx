'use client'
import { Button } from '@mui/material'
import React, { useState } from 'react'
type ThemeModeTypes = 'dark' | 'ligth'
export const ThemeComponent = () => {
    const [toggleTheme, setToggleTheme] = useState<ThemeModeTypes>('ligth')

    return (
        <div>
            {toggleTheme === 'dark' ?
                <Button onClick={()=> setToggleTheme('ligth')}> cambiar a ligth</Button>
                :
                <Button onClick={()=> setToggleTheme('dark')}> cambiar a dark</Button>
            }
            </div>
    )
}
