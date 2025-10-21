import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  Button,
  Chip,
  Rating,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  Reviews,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
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
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  isVerified: boolean;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.getProduct(id!);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const success = await addToCart(
      product.id,
      product.name,
      product.price,
      quantity
    );
    
    if (success) {
      console.log('Product added to cart');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={product.averageRating}
                readOnly
                size="large"
                sx={{ mr: 1 }}
              />
              <Typography variant="body1" color="text.secondary">
                ({product.totalReviews} reviews)
              </Typography>
            </Box>

            <Chip
              label={product.category}
              color="primary"
              sx={{ mb: 3 }}
            />

            <Typography variant="h4" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1">Quantity:</Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                inputProps={{
                  min: 1,
                  max: product.stockQuantity,
                  style: { textAlign: 'center', width: '80px' }
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
              <Typography variant="body2" color="text.secondary">
                {product.stockQuantity} in stock
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                startIcon={<ShoppingCart />}
                sx={{ 
                  flexGrow: 1,
                  '&:focus': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{ 
                  '&:focus': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleShare}
                startIcon={<Share />}
                sx={{ 
                  '&:focus': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                Share
              </Button>
            </Box>

            {product.stockQuantity === 0 && (
              <Alert severity="warning">
                This product is currently out of stock
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Customer Reviews
          </Typography>
          
          <Paper sx={{ p: 3 }}>
            {product.reviews.map((review) => (
              <Box key={review.id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">
                    {review.customerName}
                    {review.isVerified && (
                      <Chip
                        label="Verified"
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                {review.comment && (
                  <Typography variant="body1" paragraph>
                    {review.comment}
                  </Typography>
                )}
                
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage;
