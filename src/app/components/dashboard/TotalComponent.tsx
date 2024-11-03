// TotalGastos.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export const TotalComponent = ({ total }: {total:number}) => {
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
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Total de Gastos
        </Typography>
        <Typography variant="h4" component="div" sx={{ color: '#e53935', marginTop: 1 }}>
          ${total.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};


