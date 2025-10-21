using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShoppingCart.Application.Common.Interfaces;
using ShoppingCart.Infrastructure.Services;
using StackExchange.Redis;

namespace ShoppingCart.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Redis
        services.AddSingleton<IConnectionMultiplexer>(provider =>
        {
            var connectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";
            return ConnectionMultiplexer.Connect(connectionString);
        });

        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IMessagePublisher, MessagePublisher>();

        return services;
    }
}
