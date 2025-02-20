namespace UserService.API.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty!;

        public string Email { get; set; } = string.Empty!;

        public string? LanguagePreference { get; set; }

        public int UserType { get; set; }
    }
}
