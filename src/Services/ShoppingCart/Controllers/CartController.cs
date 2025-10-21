using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Application.Cart.Commands.AddItem;
using ShoppingCart.Application.Cart.Queries.GetCart;

namespace ShoppingCart.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get user's shopping cart
    /// </summary>
    [HttpGet("{userId}")]
    public async Task<ActionResult<CartDto>> GetCart(string userId)
    {
        var result = await _mediator.Send(new GetCartQuery(userId));
        return Ok(result);
    }

    /// <summary>
    /// Add item to shopping cart
    /// </summary>
    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem(AddItemCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Update item quantity in cart
    /// </summary>
    [HttpPut("items/{productId}")]
    public async Task<ActionResult<CartDto>> UpdateItem(Guid productId, [FromBody] UpdateItemQuantityRequest request)
    {
        // Implementation would go here
        return Ok();
    }

    /// <summary>
    /// Remove item from cart
    /// </summary>
    [HttpDelete("items/{productId}")]
    public async Task<ActionResult<CartDto>> RemoveItem(string userId, Guid productId)
    {
        // Implementation would go here
        return Ok();
    }

    /// <summary>
    /// Clear entire cart
    /// </summary>
    [HttpDelete("{userId}")]
    public async Task<ActionResult> ClearCart(string userId)
    {
        // Implementation would go here
        return Ok();
    }
}

public record UpdateItemQuantityRequest
{
    public int Quantity { get; init; }
}
