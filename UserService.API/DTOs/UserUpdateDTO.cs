namespace UserService.API.DTOs
{
    public class UserUpdateDTO
    {
        public int Id { get; set; }

        public string? FullName { get; set; }

        public string? Password { get; set; }

        public string? LanguagePreference { get; set; }
    }
}
