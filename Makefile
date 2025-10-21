# E-Commerce System Makefile

.PHONY: help build up down logs clean test lint format

# Default target
help: ## Show this help message
	@echo "E-Commerce System - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
build: ## Build all Docker images
	docker-compose build

up: ## Start all services in development mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs for all services
	docker-compose logs -f

clean: ## Clean up containers, volumes, and images
	docker-compose down -v --rmi all --remove-orphans

# Production commands
build-prod: ## Build all Docker images for production
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

up-prod: ## Start all services in production mode
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down-prod: ## Stop all production services
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Service-specific commands
up-db: ## Start only database services
	docker-compose up -d postgres-product postgres-order postgres-user redis rabbitmq

up-services: ## Start only microservices
	docker-compose up -d product-catalog-service shopping-cart-service order-management-service user-management-service email-service api-gateway

up-frontend: ## Start only frontend
	docker-compose up -d frontend

# Development tools
test: ## Run tests for all services
	@echo "Running tests..."
	@cd src/Services/ProductCatalog && dotnet test
	@cd src/Services/ShoppingCart && dotnet test
	@cd src/Services/OrderManagement && dotnet test
	@cd src/Services/UserManagement && dotnet test
	@cd src/Services/EmailService && dotnet test

lint: ## Run linting for all services
	@echo "Running linting..."
	@cd src/Services/ProductCatalog && dotnet format --verify-no-changes
	@cd src/Services/ShoppingCart && dotnet format --verify-no-changes
	@cd src/Services/OrderManagement && dotnet format --verify-no-changes
	@cd src/Services/UserManagement && dotnet format --verify-no-changes
	@cd src/Services/EmailService && dotnet format --verify-no-changes

format: ## Format code for all services
	@echo "Formatting code..."
	@cd src/Services/ProductCatalog && dotnet format
	@cd src/Services/ShoppingCart && dotnet format
	@cd src/Services/OrderManagement && dotnet format
	@cd src/Services/UserManagement && dotnet format
	@cd src/Services/EmailService && dotnet format

# Database commands
migrate: ## Run database migrations
	@echo "Running migrations..."
	@cd src/Services/ProductCatalog && dotnet ef database update
	@cd src/Services/OrderManagement && dotnet ef database update
	@cd src/Services/UserManagement && dotnet ef database update

# Health checks
health: ## Check health of all services
	@echo "Checking service health..."
	@curl -f http://localhost:5000/health || echo "API Gateway: DOWN"
	@curl -f http://localhost:5001/health || echo "Product Catalog: DOWN"
	@curl -f http://localhost:5002/health || echo "Shopping Cart: DOWN"
	@curl -f http://localhost:5003/health || echo "Order Management: DOWN"
	@curl -f http://localhost:5004/health || echo "User Management: DOWN"
	@curl -f http://localhost:5005/health || echo "Email Service: DOWN"
	@curl -f http://localhost:3000/health || echo "Frontend: DOWN"

# Monitoring
monitor: ## Show resource usage
	docker stats

# Quick start
quick-start: build up-db up-services up-frontend ## Quick start - build and start all services
	@echo "E-Commerce System is starting up..."
	@echo "Frontend: http://localhost:3000"
	@echo "API Gateway: http://localhost:5000"
	@echo "RabbitMQ Management: http://localhost:15672 (admin/admin)"
	@echo "PostgreSQL: localhost:5432,5433,5434"
	@echo "Redis: localhost:6379"
