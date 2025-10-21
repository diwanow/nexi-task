import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Star,
  ShoppingCart,
  TrendingUp,
  Security,
  Support,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  averageRating: number;
  totalReviews: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts({ pageSize: 8 });
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    const success = await addToCart(
      product.id,
      product.name,
      product.price,
      1
    );
    
    if (success) {
      // Show success message (could be implemented with a snackbar)
      console.log('Product added to cart');
    }
  };

  const handleSearch = () => {
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const features = [
    {
      icon: <TrendingUp />,
      title: 'Best Prices',
      description: 'Competitive pricing on all products',
    },
    {
      icon: <Security />,
      title: 'Secure Shopping',
      description: 'Your data is protected with industry-standard security',
    },
    {
      icon: <Support />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to E-Commerce Platform
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Discover amazing products at unbeatable prices
          </Typography>
          
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { 
                  backgroundColor: 'white',
                  '&:focus-within': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              sx={{ 
                mt: 2,
                '&:focus': {
                  outline: '2px solid white',
                  outlineOffset: '2px',
                }
              }}
            >
              Search Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  '&:focus-within': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Featured Products
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:focus-within': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || '/placeholder-product.jpg'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2">
                      {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ mb: 2, alignSelf: 'flex-start' }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="h6" color="primary">
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      sx={{
                        '&:focus': {
                          outline: '2px solid #1976d2',
                          outlineOffset: '2px',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              '&:focus': {
                outline: '2px solid #1976d2',
                outlineOffset: '2px',
              }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
