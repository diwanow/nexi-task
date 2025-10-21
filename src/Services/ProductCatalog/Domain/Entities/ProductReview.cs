using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.Domain.Entities;

public class ProductReview
{
    public Guid Id { get; set; }
    
    public Guid ProductId { get; set; }
    
    [Required]
    [StringLength(100)]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [StringLength(1000)]
    public string? Comment { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsVerified { get; set; } = false;
    
    // Navigation properties
    public virtual Product Product { get; set; } = null!;
}
