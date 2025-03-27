using AuthService.Core.Entities;

namespace AuthService.Core.Interfaces
{
    public interface IAuthRepository
    {
        Task<RefreshToken> AddRefreshTokenAsync (RefreshToken token);
        Task<RefreshToken> GetRefreshTokenAsync (string token);
        Task<bool> MarkRefreshTokenAsUsedAsync (RefreshToken token);
    }
}
