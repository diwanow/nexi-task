using System.Text;
using System.Text.Json;
using EmailService.Application.Common.Interfaces;
using EmailService.Application.Email.Commands.SendMonthlyReport;
using MediatR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace EmailService.Infrastructure.Services;

public class RabbitMQMessageConsumer : IMessageConsumer
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly IMediator _mediator;
    private readonly JsonSerializerOptions _jsonOptions;
    private bool _isConsuming = false;

    public RabbitMQMessageConsumer(IMediator mediator)
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost",
            Port = 5672,
            UserName = "admin",
            Password = "admin"
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
        _mediator = mediator;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        // Declare exchanges and queues
        _channel.ExchangeDeclare("email.events", ExchangeType.Topic, true);
        _channel.QueueDeclare("email.monthly-report", true, false, false, null);
        _channel.QueueBind("email.monthly-report", "email.events", "email.monthly.report");
    }

    public async Task StartConsumingAsync(CancellationToken cancellationToken = default)
    {
        if (_isConsuming) return;

        _isConsuming = true;
        var consumer = new EventingBasicConsumer(_channel);
        
        consumer.Received += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var routingKey = ea.RoutingKey;

                await ProcessMessageAsync(message, routingKey, cancellationToken);
                
                _channel.BasicAck(ea.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing message: {ex.Message}");
                _channel.BasicNack(ea.DeliveryTag, false, true);
            }
        };

        _channel.BasicConsume("email.monthly-report", false, consumer);
        
        await Task.CompletedTask;
    }

    public async Task StopConsumingAsync(CancellationToken cancellationToken = default)
    {
        _isConsuming = false;
        _channel?.Close();
        _connection?.Close();
        await Task.CompletedTask;
    }

    private async Task ProcessMessageAsync(string message, string routingKey, CancellationToken cancellationToken)
    {
        switch (routingKey)
        {
            case "email.monthly.report":
                await ProcessMonthlyReportMessageAsync(message, cancellationToken);
                break;
            default:
                Console.WriteLine($"Unknown routing key: {routingKey}");
                break;
        }
    }

    private async Task ProcessMonthlyReportMessageAsync(string message, CancellationToken cancellationToken)
    {
        try
        {
            var reportData = JsonSerializer.Deserialize<MonthlyReportMessage>(message, _jsonOptions);
            if (reportData != null)
            {
                var command = new SendMonthlyReportCommand
                {
                    UserId = reportData.UserId,
                    UserEmail = reportData.UserEmail,
                    UserName = reportData.UserName,
                    Transactions = reportData.Transactions,
                    ReportMonth = reportData.ReportMonth
                };

                await _mediator.Send(command, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing monthly report message: {ex.Message}");
        }
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        _channel?.Dispose();
        _connection?.Dispose();
    }
}

public record MonthlyReportMessage
{
    public string UserId { get; init; } = string.Empty;
    public string UserEmail { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public IList<TransactionDto> Transactions { get; init; } = new List<TransactionDto>();
    public DateTime ReportMonth { get; init; }
}

public record TransactionDto
{
    public string OrderNumber { get; init; } = string.Empty;
    public DateTime OrderDate { get; init; }
    public decimal TotalAmount { get; init; }
    public string Status { get; init; } = string.Empty;
    public IList<OrderItemDto> Items { get; init; } = new List<OrderItemDto>();
}

public record OrderItemDto
{
    public string ProductName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
    public decimal TotalPrice { get; init; }
}
