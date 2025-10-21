using System.ComponentModel.DataAnnotations;

namespace OrderManagement.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string OrderNumber { get; set; } = string.Empty;
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    [Required]
    public string ShippingAddress { get; set; } = string.Empty;
    
    [Required]
    public string BillingAddress { get; set; } = string.Empty;
    
    [Required]
    public string PaymentMethod { get; set; } = string.Empty;
    
    public decimal SubTotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public virtual ICollection<OrderEvent> Events { get; set; } = new List<OrderEvent>();
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Returned
}
