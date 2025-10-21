using MediatR;
using OrderManagement.Application.Common.Interfaces;
using OrderManagement.Domain.Entities;
using System.Text.Json;

namespace OrderManagement.Application.Orders.Commands.CreateOrder;

public record CreateOrderCommand : IRequest<OrderDto>
{
    public string UserId { get; init; } = string.Empty;
    public string ShippingAddress { get; init; } = string.Empty;
    public string BillingAddress { get; init; } = string.Empty;
    public string PaymentMethod { get; init; } = string.Empty;
    public IList<OrderItemDto> Items { get; init; } = new List<OrderItemDto>();
    public decimal SubTotal { get; init; }
    public decimal TaxAmount { get; init; }
    public decimal ShippingCost { get; init; }
    public decimal TotalAmount { get; init; }
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMessagePublisher _messagePublisher;

    public CreateOrderCommandHandler(IApplicationDbContext context, IMessagePublisher messagePublisher)
    {
        _context = context;
        _messagePublisher = messagePublisher;
    }

    public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            OrderNumber = GenerateOrderNumber(),
            Status = OrderStatus.Pending,
            ShippingAddress = request.ShippingAddress,
            BillingAddress = request.BillingAddress,
            PaymentMethod = request.PaymentMethod,
            SubTotal = request.SubTotal,
            TaxAmount = request.TaxAmount,
            ShippingCost = request.ShippingCost,
            TotalAmount = request.TotalAmount,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Add order items
        foreach (var itemDto in request.Items)
        {
            order.Items.Add(new OrderItem
            {
                Id = Guid.NewGuid(),
                ProductId = itemDto.ProductId,
                ProductName = itemDto.ProductName,
                UnitPrice = itemDto.UnitPrice,
                Quantity = itemDto.Quantity
            });
        }

        // Add order created event
        order.Events.Add(new OrderEvent
        {
            Id = Guid.NewGuid(),
            EventType = "OrderCreated",
            EventData = JsonSerializer.Serialize(new { OrderId = order.Id, UserId = order.UserId }),
            UserId = order.UserId,
            Timestamp = DateTime.UtcNow
        });

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        // Publish order created event
        await _messagePublisher.PublishAsync("order.events", "order.created", new
        {
            OrderId = order.Id,
            UserId = order.UserId,
            OrderNumber = order.OrderNumber,
            TotalAmount = order.TotalAmount,
            Timestamp = DateTime.UtcNow
        }, cancellationToken);

        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderNumber = order.OrderNumber,
            Status = order.Status.ToString(),
            ShippingAddress = order.ShippingAddress,
            BillingAddress = order.BillingAddress,
            PaymentMethod = order.PaymentMethod,
            SubTotal = order.SubTotal,
            TaxAmount = order.TaxAmount,
            ShippingCost = order.ShippingCost,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Items = order.Items.Select(item => new OrderItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity,
                TotalPrice = item.TotalPrice
            }).ToList()
        };
    }

    private static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
    }
}

public record OrderDto
{
    public Guid Id { get; init; }
    public string UserId { get; init; } = string.Empty;
    public string OrderNumber { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string ShippingAddress { get; init; } = string.Empty;
    public string BillingAddress { get; init; } = string.Empty;
    public string PaymentMethod { get; init; } = string.Empty;
    public decimal SubTotal { get; init; }
    public decimal TaxAmount { get; init; }
    public decimal ShippingCost { get; init; }
    public decimal TotalAmount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public IList<OrderItemDto> Items { get; init; } = new List<OrderItemDto>();
}

public record OrderItemDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
    public decimal TotalPrice { get; init; }
}
