
'use client'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { ProductCat } from '@/app/dashboard/productos/page';
import { Producto } from '@/app/dashboard/pagos/page';


interface Props {
  handleCheck : (e : ProductCat, type: 'add' | 'remove')=>void,
  producto : Producto
}
export const TarjetaProductoComponent = ({ handleCheck, producto}:Props) => {

  const [check, setCheck] = useState<Boolean>(false)
  return (
    <Card sx={{ maxWidth: 200 }}>
      <CardMedia
        component="img"
        alt={producto.label}
        height="140"
        image="/babysec Gx60.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {producto.label}
        </Typography>
          <Typography variant='body2'color="text.secondary"><strong>Precio:</strong>${producto.precio}</Typography>
          <Typography variant='body2'color="text.secondary"><strong>Stock:</strong>{producto.cantidad} unidades</Typography>

      </CardContent>
      <CardActions>
      <FormControlLabel onClick={()=>{
        handleCheck({id:producto.cod, name:'babysec G x 60'}, check ? 'remove' : 'add')
        setCheck(!check)
        }} control={<Checkbox  />} label="Registrar" />

        <Button size="small">Editar</Button>
      </CardActions>
    </Card>
  );
}
