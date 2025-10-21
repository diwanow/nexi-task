using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EmailService.Application.Common.Interfaces;
using EmailService.Infrastructure.Services;

namespace EmailService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Email Service
        services.AddScoped<IEmailService, SendGridEmailService>();

        // PDF Service
        services.AddScoped<IPdfService, iTextPdfService>();

        // Message Consumer
        services.AddScoped<IMessageConsumer, RabbitMQMessageConsumer>();

        return services;
    }
}
