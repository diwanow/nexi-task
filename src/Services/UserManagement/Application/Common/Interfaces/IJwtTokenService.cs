using UserManagement.Domain.Entities;

namespace UserManagement.Application.Common.Interfaces;

public interface IJwtTokenService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
    Task<string?> ValidateTokenAsync(string token);
}
