# E-Commerce Microservices System

A modern, scalable e-commerce platform built with .NET 8 microservices architecture, designed for high availability, fault tolerance, and European scale compliance.

## 🏗️ Architecture Overview

This system implements a microservices architecture with the following components:

- **Product Catalog Service**: Manages product information with CQRS pattern
- **Shopping Cart Service**: Handles cart operations with Redis caching
- **Order Management Service**: Processes orders with event sourcing
- **User Management Service**: Authentication and user profiles
- **Email Service**: PDF generation and transactional emails
- **API Gateway**: Routing, rate limiting, and authentication

## 🚀 Features

- **High Availability**: Multi-instance deployment with load balancing
- **Fault Tolerance**: Circuit breakers, retries, and graceful degradation
- **European Scale**: GDPR compliance, multi-region ready
- **Accessibility**: WCAG 2.1 AA compliant frontend
- **Event-Driven**: Asynchronous communication between services
- **CQRS**: Separate read/write models for optimal performance
- **Monitoring**: Comprehensive logging and health checks

## 🛠️ Technology Stack

- **Backend**: .NET 8, ASP.NET Core Web APIs
- **Database**: PostgreSQL with Entity Framework Core
- **Caching**: Redis for session management
- **Message Queue**: RabbitMQ for event communication
- **API Gateway**: Ocelot
- **Frontend**: React with TypeScript, Material-UI
- **PDF Generation**: iTextSharp
- **Email**: SendGrid
- **Containerization**: Docker

## 🏃‍♂️ Quick Start

### Prerequisites
- Docker Desktop
- .NET 8 SDK
- Node.js 18+

### Option 1: Using Make (Recommended)
```bash
git clone <repository-url>
cd ecommerce-system
make quick-start
```

### Option 2: Using Docker Compose
```bash
git clone <repository-url>
cd ecommerce-system
docker-compose up -d
```

### Option 3: Manual Setup
```bash
# Start infrastructure services
make up-db

# Start microservices
make up-services

# Start frontend
make up-frontend
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **Swagger Documentation**: http://localhost:5000/swagger
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **PostgreSQL**: localhost:5432,5433,5434
- **Redis**: localhost:6379

## 📁 Project Structure

```
├── src/
│   ├── Services/
│   │   ├── ProductCatalog/          # Product management with CQRS
│   │   ├── ShoppingCart/            # Cart operations with Redis
│   │   ├── OrderManagement/        # Order processing with event sourcing
│   │   ├── UserManagement/         # Authentication and user profiles
│   │   └── EmailService/           # PDF generation and email sending
│   ├── Gateway/                    # API Gateway with Ocelot
│   └── Frontend/                   # React SPA with accessibility
├── docker-compose.yml              # Development configuration
├── docker-compose.prod.yml         # Production configuration
├── Makefile                        # Development commands
└── README.md
```

## 🔧 Development

### Available Commands

```bash
# Show all available commands
make help

# Build all services
make build

# Start development environment
make up

# View logs
make logs

# Run tests
make test

# Format code
make format

# Check service health
make health

# Clean up everything
make clean
```

### Running Individual Services

```bash
# Product Catalog Service
cd src/Services/ProductCatalog
dotnet run

# Shopping Cart Service
cd src/Services/ShoppingCart
dotnet run

# Order Management Service
cd src/Services/OrderManagement
dotnet run
```

### Database Migrations

```bash
# Apply migrations
make migrate

# Or manually:
dotnet ef database update --project src/Services/ProductCatalog
dotnet ef database update --project src/Services/OrderManagement
dotnet ef database update --project src/Services/UserManagement
```

## 🧪 Testing

```bash
# Run all tests
make test

# Run specific service tests
cd src/Services/ProductCatalog && dotnet test
cd src/Services/ShoppingCart && dotnet test
cd src/Services/OrderManagement && dotnet test
cd src/Services/UserManagement && dotnet test
cd src/Services/EmailService && dotnet test
```

## 📊 Monitoring & Health Checks

### Health Endpoints
- API Gateway: http://localhost:5000/health
- Product Catalog: http://localhost:5001/health
- Shopping Cart: http://localhost:5002/health
- Order Management: http://localhost:5003/health
- User Management: http://localhost:5004/health
- Email Service: http://localhost:5005/health
- Frontend: http://localhost:3000/health

### Logging
- Structured logging with Serilog
- Console and file output
- Log levels: Information, Warning, Error
- Log files: `logs/{service-name}-{date}.txt`

### Monitoring Commands
```bash
# Check all service health
make health

# Monitor resource usage
make monitor

# View service logs
make logs
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API Gateway rate limiting per endpoint
- **Input Validation**: Comprehensive validation on all inputs
- **HTTPS Enforcement**: Secure communication
- **GDPR Compliance**: Data protection and privacy features
- **Accessibility**: WCAG 2.1 AA compliant frontend

## 🌍 Production Deployment

### Environment Variables
Copy `env.example` to `.env` and configure:

```bash
# Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password

# Redis
REDIS_PASSWORD=your_redis_password

# RabbitMQ
RABBITMQ_USER=your_rabbitmq_user
RABBITMQ_PASSWORD=your_rabbitmq_password

# Email
SENDGRID_API_KEY=your_sendgrid_api_key

# JWT
JWT_SECRET_KEY=your_super_secret_key_at_least_32_chars
```

### Production Commands
```bash
# Build production images
make build-prod

# Deploy to production
make up-prod

# Stop production services
make down-prod
```

### European Scale Features
- **Multi-region deployment ready**
- **GDPR compliance built-in**
- **Data residency support**
- **Accessibility standards (WCAG 2.1 AA)**
- **High availability configuration**

## 📝 API Documentation

### Swagger Documentation
- **API Gateway**: http://localhost:5000/swagger
- **Individual Services**: Each service has its own Swagger endpoint

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (admin)

#### Shopping Cart
- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{productId}` - Update cart item
- `DELETE /api/cart/items/{productId}` - Remove from cart

#### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details

#### Email
- `POST /api/email/monthly-report` - Send monthly report

## 🎨 Frontend Features

### Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Clear focus indicators
- **Touch Targets**: Minimum 44px touch targets
- **Color Contrast**: Meets AA contrast ratios

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive design for all screen sizes
- **Touch Friendly**: Touch-optimized interactions

### Features
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add, update, remove items
- **User Authentication**: Login/register with validation
- **Order Management**: View order history
- **Profile Management**: Update user information

## 🔄 Event-Driven Architecture

### Message Flow
1. **User Actions** → API Gateway → Microservices
2. **Service Events** → RabbitMQ → Other Services
3. **Email Events** → Email Service → PDF Generation
4. **Order Events** → Order Management → Event Sourcing

### Event Types
- `user.registered` - User registration
- `user.logged_in` - User login
- `cart.item.added` - Item added to cart
- `cart.item.updated` - Cart item updated
- `cart.item.removed` - Item removed from cart
- `order.created` - New order created
- `email.monthly.report` - Monthly report request

## 🚀 Performance Optimizations

### Caching Strategy
- **Redis Caching**: Product catalog, user sessions
- **HTTP Caching**: Static assets, API responses
- **Database Indexing**: Optimized queries

### Load Balancing
- **API Gateway**: Request routing and load balancing
- **Service Replication**: Multiple instances per service
- **Health Checks**: Automatic failover

### Database Optimization
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed queries
- **Read Replicas**: Separate read/write databases

## 🛠️ Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check service health
make health

# View service logs
make logs

# Restart specific service
docker-compose restart service-name
```

#### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres-*

# View database logs
docker-compose logs postgres-product
```

#### Frontend Build Issues
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Debug Mode
```bash
# Run with debug logging
ASPNETCORE_ENVIRONMENT=Development docker-compose up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `make test`
5. Format code: `make format`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Submit a pull request

### Development Guidelines
- Follow C# coding conventions
- Write unit tests for new features
- Update documentation for API changes
- Ensure accessibility compliance
- Test with multiple browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the React component library
- **Ocelot** for API Gateway functionality
- **Serilog** for structured logging
- **iTextSharp** for PDF generation
- **SendGrid** for email services

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**Built with ❤️ for modern e-commerce**
