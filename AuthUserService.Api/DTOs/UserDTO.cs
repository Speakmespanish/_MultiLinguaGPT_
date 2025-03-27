namespace AuthUserService.Api.DTOs
{
    public class UserDTO
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Languaje { get; set; } 
    }
}
