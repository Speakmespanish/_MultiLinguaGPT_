using System;
using UserService.Core.Enums;

namespace UserService.Core.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty!;

        public string Email { get; set; } = string.Empty!;

        public string Password { get; set; } = string.Empty!;

        public string? LanguagePreference { get; set; }

        public UserType UserType { get; set; }
    }
}
