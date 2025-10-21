# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["src/Services/EmailService/EmailService.csproj", "src/Services/EmailService/"]
COPY ["src/Shared/", "src/Shared/"]

# Restore dependencies
RUN dotnet restore "src/Services/EmailService/EmailService.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/src/Services/EmailService"
RUN dotnet build "EmailService.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "EmailService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE 80

ENTRYPOINT ["dotnet", "EmailService.dll"]
