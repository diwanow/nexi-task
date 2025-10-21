using MediatR;
using Microsoft.AspNetCore.Identity;
using UserManagement.Application.Common.Interfaces;
using UserManagement.Domain.Entities;

namespace UserManagement.Application.Auth.Commands.Login;

public record LoginCommand : IRequest<AuthResult>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IMessagePublisher _messagePublisher;

    public LoginCommandHandler(
        UserManager<ApplicationUser> userManager,
        IJwtTokenService jwtTokenService,
        IMessagePublisher messagePublisher)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _messagePublisher = messagePublisher;
    }

    public async Task<AuthResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Invalid email or password."
            };
        }

        if (!user.IsActive)
        {
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Account is deactivated."
            };
        }

        var isValidPassword = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isValidPassword)
        {
            return new AuthResult
            {
                Success = false,
                ErrorMessage = "Invalid email or password."
            };
        }

        // Generate JWT token
        var token = await _jwtTokenService.GenerateTokenAsync(user);

        // Publish user login event
        await _messagePublisher.PublishAsync("user.events", "user.logged_in", new
        {
            UserId = user.Id,
            Email = user.Email,
            Timestamp = DateTime.UtcNow
        }, cancellationToken);

        return new AuthResult
        {
            Success = true,
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Address = user.Address,
                City = user.City,
                PostalCode = user.PostalCode,
                Country = user.Country,
                DateOfBirth = user.DateOfBirth,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }
        };
    }
}

public record AuthResult
{
    public bool Success { get; init; }
    public string? Token { get; init; }
    public string? ErrorMessage { get; init; }
    public UserDto? User { get; init; }
}

public record UserDto
{
    public string Id { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Address { get; init; }
    public string? City { get; init; }
    public string? PostalCode { get; init; }
    public string? Country { get; init; }
    public DateTime DateOfBirth { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
