namespace Common.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }

        public required string FullName { get; set; }

        public required string Email { get; set; }

        public string? LanguagePreference { get; set; }

        public int UserType { get; set; }
    }
}
