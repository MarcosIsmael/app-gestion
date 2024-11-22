import { Box, BoxProps } from '@mui/material'
import React from 'react'
interface Props {
    children: React.ReactNode
    boxProps?: BoxProps
}
export const ContainerComponent = ({ children,boxProps  }: Props) => {
    return (<Box p={2} {...boxProps}  margin={'auto'} data-name='Container component' >
        {children}
    </Box>

    )
}
