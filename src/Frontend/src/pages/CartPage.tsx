import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ShoppingBag,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" sx={{ py: 8 }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add some products to get started
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ 
              '&:focus': {
                outline: '2px solid #1976d2',
                outlineOffset: '2px',
              }
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearCart}
              startIcon={<Delete />}
              sx={{ 
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
            >
              Clear Cart
            </Button>
          </Box>

          {cart.items.map((item) => (
            <Card key={item.productId} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.unitPrice.toFixed(2)} each
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        sx={{ 
                          '&:focus': {
                            outline: '2px solid #1976d2',
                            outlineOffset: '2px',
                          }
                        }}
                      >
                        <Remove />
                      </IconButton>
                      
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.productId, newQuantity);
                        }}
                        inputProps={{
                          min: 1,
                          style: { textAlign: 'center', width: '60px' }
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          '&:focus-within': {
                            outline: '2px solid #1976d2',
                            outlineOffset: '2px',
                          }
                        }}
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        sx={{ 
                          '&:focus': {
                            outline: '2px solid #1976d2',
                            outlineOffset: '2px',
                          }
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="primary">
                      ${item.totalPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.productId)}
                      sx={{ 
                        '&:focus': {
                          outline: '2px solid #1976d2',
                          outlineOffset: '2px',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">${cart.totalAmount.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping:</Typography>
              <Typography variant="body1">$0.00</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Tax:</Typography>
              <Typography variant="body1">$0.00</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${cart.totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              startIcon={<ShoppingBag />}
              sx={{ 
                mb: 2,
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/products')}
              sx={{ 
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
