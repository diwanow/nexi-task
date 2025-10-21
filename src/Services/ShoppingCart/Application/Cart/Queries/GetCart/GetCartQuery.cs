using MediatR;
using ShoppingCart.Application.Common.Interfaces;

namespace ShoppingCart.Application.Cart.Queries.GetCart;

public record GetCartQuery(string UserId) : IRequest<CartDto>;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto>
{
    private readonly ICartService _cartService;

    public GetCartQueryHandler(ICartService cartService)
    {
        _cartService = cartService;
    }

    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _cartService.GetCartAsync(request.UserId, cancellationToken);
        
        return new CartDto
        {
            UserId = cart.UserId,
            Items = cart.Items.Select(item => new CartItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity,
                TotalPrice = item.TotalPrice,
                AddedAt = item.AddedAt
            }).ToList(),
            TotalAmount = cart.TotalAmount,
            TotalItems = cart.TotalItems,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }
}

public record CartDto
{
    public string UserId { get; init; } = string.Empty;
    public IList<CartItemDto> Items { get; init; } = new List<CartItemDto>();
    public decimal TotalAmount { get; init; }
    public int TotalItems { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record CartItemDto
{
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
    public decimal TotalPrice { get; init; }
    public DateTime AddedAt { get; init; }
}
