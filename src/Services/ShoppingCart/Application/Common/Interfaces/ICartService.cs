using ShoppingCart.Domain.Entities;

namespace ShoppingCart.Application.Common.Interfaces;

public interface ICartService
{
    Task<ShoppingCart> GetCartAsync(string userId, CancellationToken cancellationToken = default);
    Task AddItemAsync(string userId, Guid productId, string productName, decimal unitPrice, int quantity, CancellationToken cancellationToken = default);
    Task UpdateItemQuantityAsync(string userId, Guid productId, int quantity, CancellationToken cancellationToken = default);
    Task RemoveItemAsync(string userId, Guid productId, CancellationToken cancellationToken = default);
    Task ClearCartAsync(string userId, CancellationToken cancellationToken = default);
    Task<bool> ItemExistsAsync(string userId, Guid productId, CancellationToken cancellationToken = default);
}
