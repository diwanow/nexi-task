using Microsoft.EntityFrameworkCore;
using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<ProductReview> ProductReviews { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
