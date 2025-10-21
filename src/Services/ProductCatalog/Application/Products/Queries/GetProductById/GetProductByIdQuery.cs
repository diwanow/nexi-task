using MediatR;
using ProductCatalog.Application.Common.Interfaces;

namespace ProductCatalog.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDetailDto?>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDetailDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetProductByIdQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<ProductDetailDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"product:{request.Id}";
        
        var cachedResult = await _cacheService.GetAsync<ProductDetailDto>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            return cachedResult;
        }

        var product = await _context.Products
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.IsActive, cancellationToken);

        if (product == null)
        {
            return null;
        }

        var result = new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Category = product.Category,
            SKU = product.SKU,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            Reviews = product.Reviews.Select(r => new ProductReviewDto
            {
                Id = r.Id,
                CustomerName = r.CustomerName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                IsVerified = r.IsVerified
            }).ToList(),
            AverageRating = product.Reviews.Any() ? product.Reviews.Average(r => r.Rating) : 0,
            TotalReviews = product.Reviews.Count
        };

        // Cache the result for 10 minutes
        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(10), cancellationToken);

        return result;
    }
}

public record ProductDetailDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string Category { get; init; } = string.Empty;
    public string SKU { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
    public string? ImageUrl { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public IList<ProductReviewDto> Reviews { get; init; } = new List<ProductReviewDto>();
    public double AverageRating { get; init; }
    public int TotalReviews { get; init; }
}

public record ProductReviewDto
{
    public Guid Id { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public int Rating { get; init; }
    public string? Comment { get; init; }
    public DateTime CreatedAt { get; init; }
    public bool IsVerified { get; init; }
}
