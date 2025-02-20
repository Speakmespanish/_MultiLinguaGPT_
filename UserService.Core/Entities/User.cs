using System;
using UserService.Core.Enums;

namespace UserService.Core.Entities
{
    public class User
    {
        public int Id { get; set; }

        public required string FullName { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

        public string? LanguagePreference { get; set; }

        public UserType UserType { get; set; }
    }
}
