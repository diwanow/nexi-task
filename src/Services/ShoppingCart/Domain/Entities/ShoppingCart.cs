namespace ShoppingCart.Domain.Entities;

public class ShoppingCart
{
    public string UserId { get; set; } = string.Empty;
    public List<CartItem> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(item => item.TotalPrice);
    public int TotalItems => Items.Sum(item => item.Quantity);
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
