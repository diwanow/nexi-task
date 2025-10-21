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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Rating,
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  Star,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDescending, setSortDescending] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Newest' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [page, category, sortBy, sortDescending, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        pageNumber: page,
        pageSize: 12,
        sortBy,
        sortDescending,
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (category) params.category = category;

      const response = await api.getProducts(params);
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalCount(response.data.totalCount || 0);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = async (product: Product) => {
    const success = await addToCart(
      product.id,
      product.name,
      product.price,
      1
    );
    
    if (success) {
      console.log('Product added to cart');
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Products
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
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
                  '&:focus-within': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                sx={{ 
                  '&:focus-within': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                sx={{ 
                  '&:focus-within': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  }
                }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              onClick={() => setSortDescending(!sortDescending)}
              startIcon={<FilterList />}
              fullWidth
              sx={{ 
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
            >
              {sortDescending ? 'Desc' : 'Asc'}
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={handleSearch}
              fullWidth
              sx={{ 
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {products.length} of {totalCount} products
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4,
                },
                '&:focus-within': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
              onClick={() => navigate(`/products/${product.id}`)}
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
                  <Rating
                    value={product.averageRating}
                    readOnly
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({product.totalReviews})
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stockQuantity === 0}
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
                
                {product.stockQuantity === 0 && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Out of Stock
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {products.length === 0 && !loading && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
