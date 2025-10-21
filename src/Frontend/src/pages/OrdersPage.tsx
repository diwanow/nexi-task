import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Receipt,
  LocalShipping,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders({ userId: user?.id });
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpanded = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle />;
      case 'shipped':
        return <LocalShipping />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Receipt />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Please log in to view your orders
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't placed any orders yet
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/products'}
            sx={{ 
              '&:focus': {
                outline: '2px solid #1976d2',
                outlineOffset: '2px',
              }
            }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="primary">
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      onClick={() => handleToggleExpanded(order.id)}
                      sx={{ 
                        '&:focus': {
                          outline: '2px solid #1976d2',
                          outlineOffset: '2px',
                        }
                      }}
                    >
                      {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Grid>
                </Grid>

                <Collapse in={expandedOrder === order.id}>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Order Items
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrdersPage;
