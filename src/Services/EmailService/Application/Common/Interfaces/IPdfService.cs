namespace EmailService.Application.Common.Interfaces;

public interface IPdfService
{
    Task<byte[]> GenerateTransactionReportAsync(string userId, IList<TransactionDto> transactions, CancellationToken cancellationToken = default);
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
