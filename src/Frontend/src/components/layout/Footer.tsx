import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              E-Commerce Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your trusted online shopping destination with a wide range of products,
              secure payments, and excellent customer service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="primary"
                aria-label="Facebook"
                size="small"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Twitter"
                size="small"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Instagram"
                size="small"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="LinkedIn"
                size="small"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/products"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Products
              </Link>
              <Link
                href="/about"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Contact
              </Link>
              <Link
                href="/support"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Support
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/shipping"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/privacy"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                color="text.secondary"
                underline="hover"
                sx={{ 
                  '&:focus': { 
                    outline: '2px solid #1976d2', 
                    outlineOffset: '2px' 
                  } 
                }}
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  support@ecommerce.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  123 Commerce St, Business City, BC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} E-Commerce Platform. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with accessibility in mind - WCAG 2.1 AA compliant
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
