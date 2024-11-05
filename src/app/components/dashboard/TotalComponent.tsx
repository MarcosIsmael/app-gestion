// TotalGastos.js
import React from 'react';
import { Card, CardContent, CardHeader, Typography, TypographyProps } from '@mui/material';

interface Props {
  total: number;
  titulo: string
  contentProps?: TypographyProps
}
export const TotalComponent = ({ total, titulo, contentProps }: Props) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 3,
        margin: 2,
      }}
    >
      <CardHeader title={titulo} >
        {titulo}
      </CardHeader>
      <CardContent>
        <Typography variant="h4" component="div" {...contentProps} >
          ${total.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};


