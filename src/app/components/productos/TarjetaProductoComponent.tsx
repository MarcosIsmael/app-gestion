
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

interface Props {
  handleCheck : (e : ProductCat, type: 'add' | 'remove')=>void,
  id:number
}
export const TarjetaProductoComponent = ({ handleCheck, id}:Props) => {

  const [check, setCheck] = useState<Boolean>(false)
  return (
    <Card sx={{ maxWidth: 200 }}>
      <CardMedia
        component="img"
        alt="babysec Gx60."
        height="140"
        image="/babysec Gx60.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Babysec ultrasoft G x 60
        </Typography>
          <Typography variant='body2'color="text.secondary"><strong>Precio:</strong>$13000</Typography>
          <Typography variant='body2'color="text.secondary"><strong>Stock:</strong>4 unidades</Typography>

      </CardContent>
      <CardActions>
      <FormControlLabel onClick={()=>{
        handleCheck({id, name:'babysec G x 60'}, check ? 'remove' : 'add')
        setCheck(!check)
        }} control={<Checkbox  />} label="Registrar" />

        <Button size="small">Editar</Button>
      </CardActions>
    </Card>
  );
}
