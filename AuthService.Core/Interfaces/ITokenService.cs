using AuthService.Core.Entities;
using Common.DTOs;
using System.Security.Claims;

namespace AuthService.Core.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken (UserDTO user);
        RefreshToken GenerateRefreshToken (int userId, string jwtId);
        ClaimsPrincipal GetPrincipalFromExpiredToken (string token);
    }
}
