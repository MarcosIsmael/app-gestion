import React, { useState } from 'react'
import { AppBar, Avatar, Box, Divider, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AccountCircle } from '@mui/icons-material';
interface Props {
  handleDrawerToggle: (e: any) => void
}

export const NavbarComponent = ({ handleDrawerToggle }: Props) => {
  const drawerWidth = 240;
  const [
    anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
    color='inherit'
      position="fixed"
      elevation={1}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        height:'64px'
      }}
    >
      <Toolbar sx={{display:'flex',  height:'64px',justifyContent:'space-between',flexDirection:'row'}}>
        <Box>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <TextField
          placeholder='Que buscas?'
          variant='outlined'
          InputProps={{
            endAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }} />
        </Box>
        <Box>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>Estrella Garcia</MenuItem>
          <Divider/>
          <MenuItem onClick={handleClose}>Mi perfil</MenuItem>
          <MenuItem onClick={handleClose}>Configuración</MenuItem>
          <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
        </Menu>
        </Box>
      </Toolbar>
    </AppBar >
  )
}
