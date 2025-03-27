namespace AuthService.Core.DTOs
{
    public class RefreshTokenRequestDTO
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
