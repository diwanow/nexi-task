namespace OrderManagement.Domain.Entities;

public class OrderEvent
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string EventData { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty;
    
    // Navigation properties
    public virtual Order Order { get; set; } = null!;
}
