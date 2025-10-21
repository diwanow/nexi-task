using System.Text.Json;
using ShoppingCart.Application.Common.Interfaces;
using ShoppingCart.Domain.Entities;
using StackExchange.Redis;

namespace ShoppingCart.Infrastructure.Services;

public class CartService : ICartService
{
    private readonly IDatabase _database;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly IMessagePublisher _messagePublisher;

    public CartService(IConnectionMultiplexer connectionMultiplexer, IMessagePublisher messagePublisher)
    {
        _database = connectionMultiplexer.GetDatabase();
        _messagePublisher = messagePublisher;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    public async Task<ShoppingCart> GetCartAsync(string userId, CancellationToken cancellationToken = default)
    {
        var key = $"cart:{userId}";
        var value = await _database.StringGetAsync(key);
        
        if (!value.HasValue)
        {
            return new ShoppingCart { UserId = userId };
        }

        return JsonSerializer.Deserialize<ShoppingCart>(value!, _jsonOptions) ?? new ShoppingCart { UserId = userId };
    }

    public async Task AddItemAsync(string userId, Guid productId, string productName, decimal unitPrice, int quantity, CancellationToken cancellationToken = default)
    {
        var cart = await GetCartAsync(userId, cancellationToken);
        
        var existingItem = cart.Items.FirstOrDefault(item => item.ProductId == productId);
        
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                ProductId = productId,
                ProductName = productName,
                UnitPrice = unitPrice,
                Quantity = quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await SaveCartAsync(cart, cancellationToken);

        // Publish cart updated event
        await _messagePublisher.PublishAsync("cart.events", "cart.item.added", new
        {
            UserId = userId,
            ProductId = productId,
            Quantity = quantity,
            Timestamp = DateTime.UtcNow
        }, cancellationToken);
    }

    public async Task UpdateItemQuantityAsync(string userId, Guid productId, int quantity, CancellationToken cancellationToken = default)
    {
        var cart = await GetCartAsync(userId, cancellationToken);
        
        var item = cart.Items.FirstOrDefault(item => item.ProductId == productId);
        if (item != null)
        {
            if (quantity <= 0)
            {
                cart.Items.Remove(item);
            }
            else
            {
                item.Quantity = quantity;
            }
            
            cart.UpdatedAt = DateTime.UtcNow;
            await SaveCartAsync(cart, cancellationToken);

            // Publish cart updated event
            await _messagePublisher.PublishAsync("cart.events", "cart.item.updated", new
            {
                UserId = userId,
                ProductId = productId,
                Quantity = quantity,
                Timestamp = DateTime.UtcNow
            }, cancellationToken);
        }
    }

    public async Task RemoveItemAsync(string userId, Guid productId, CancellationToken cancellationToken = default)
    {
        var cart = await GetCartAsync(userId, cancellationToken);
        
        var item = cart.Items.FirstOrDefault(item => item.ProductId == productId);
        if (item != null)
        {
            cart.Items.Remove(item);
            cart.UpdatedAt = DateTime.UtcNow;
            await SaveCartAsync(cart, cancellationToken);

            // Publish cart updated event
            await _messagePublisher.PublishAsync("cart.events", "cart.item.removed", new
            {
                UserId = userId,
                ProductId = productId,
                Timestamp = DateTime.UtcNow
            }, cancellationToken);
        }
    }

    public async Task ClearCartAsync(string userId, CancellationToken cancellationToken = default)
    {
        var key = $"cart:{userId}";
        await _database.KeyDeleteAsync(key);

        // Publish cart cleared event
        await _messagePublisher.PublishAsync("cart.events", "cart.cleared", new
        {
            UserId = userId,
            Timestamp = DateTime.UtcNow
        }, cancellationToken);
    }

    public async Task<bool> ItemExistsAsync(string userId, Guid productId, CancellationToken cancellationToken = default)
    {
        var cart = await GetCartAsync(userId, cancellationToken);
        return cart.Items.Any(item => item.ProductId == productId);
    }

    private async Task SaveCartAsync(ShoppingCart cart, CancellationToken cancellationToken = default)
    {
        var key = $"cart:{cart.UserId}";
        var serializedCart = JsonSerializer.Serialize(cart, _jsonOptions);
        await _database.StringSetAsync(key, serializedCart, TimeSpan.FromDays(30)); // Cart expires in 30 days
    }
}
