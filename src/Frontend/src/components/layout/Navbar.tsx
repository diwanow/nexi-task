import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Home,
  Store,
  AccountCircle,
  ExitToApp,
  Receipt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cartItemCount = cart?.totalItems || 0;

  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Store /> },
  ];

  const userMenuItems = [
    { label: 'Profile', path: '/profile', icon: <AccountCircle /> },
    { label: 'Orders', path: '/orders', icon: <Receipt /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ '&:focus': { backgroundColor: 'primary.light', color: 'white' } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && userMenuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ '&:focus': { backgroundColor: 'primary.light', color: 'white' } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem
            button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            sx={{ '&:focus': { backgroundColor: 'error.light', color: 'white' } }}
          >
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleMobileToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              '&:focus': { outline: '2px solid white', outlineOffset: '2px' }
            }}
            onClick={() => navigate('/')}
            tabIndex={0}
            role="button"
            aria-label="Go to home page"
          >
            E-Commerce
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    '&:focus': { 
                      outline: '2px solid white', 
                      outlineOffset: '2px' 
                    } 
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              aria-label={`Shopping cart with ${cartItemCount} items`}
              sx={{ 
                '&:focus': { 
                  outline: '2px solid white', 
                  outlineOffset: '2px' 
                } 
              }}
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="User menu"
                aria-controls="user-menu"
                aria-haspopup="true"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid white', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                <Person />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    '&:focus': { 
                      outline: '2px solid white', 
                      outlineOffset: '2px' 
                    } 
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    '&:focus': { 
                      outline: '2px solid white', 
                      outlineOffset: '2px' 
                    } 
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              navigate(item.path);
              handleMenuClose();
            }}
            sx={{ 
              '&:focus': { 
                backgroundColor: 'primary.light', 
                color: 'white' 
              } 
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleLogout}
          sx={{ 
            '&:focus': { 
              backgroundColor: 'error.light', 
              color: 'white' 
            } 
          }}
        >
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
