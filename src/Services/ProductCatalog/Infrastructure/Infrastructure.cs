using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProductCatalog.Application.Common.Interfaces;
using ProductCatalog.Infrastructure.Persistence;
using ProductCatalog.Infrastructure.Services;
using StackExchange.Redis;

namespace ProductCatalog.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ProductCatalogDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ProductCatalogDbContext>());

        // Redis
        services.AddSingleton<IConnectionMultiplexer>(provider =>
        {
            var connectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";
            return ConnectionMultiplexer.Connect(connectionString);
        });

        services.AddScoped<ICacheService, CacheService>();

        // RabbitMQ
        services.AddScoped<IMessagePublisher, MessagePublisher>();

        return services;
    }
}
