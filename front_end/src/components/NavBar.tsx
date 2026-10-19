import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import {Button} from '@mui/material';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const nav = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    nav(path);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigate('/login')}>Sign In</MenuItem>
      <MenuItem onClick={() => handleNavigate('/signup')}>Sign Up</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" style={{ backgroundColor: '#1976d2' }}>
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => nav('/products')} 
            >
              FOOTBALL KITS
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              
              <IconButton size="large" color="inherit" onClick={() => nav('/cart')}>
                  <ShoppingCartIcon />
              </IconButton>

              <IconButton className="user-profile"
                size="large"
                edge="end"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

            </Box>
          </Toolbar>
        </Container>
        
      </AppBar>
      {renderMenu}
    </Box>
  );
}