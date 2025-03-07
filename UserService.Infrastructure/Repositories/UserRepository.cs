using AuthService.Infrastructure.SecurityCrypto;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using UserService.Core.Entities;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Data;

namespace UserService.Infrastructure.Repositories
{
    //Exceptions Classes
    public class UserAlreadyExistsException : Exception
    {
        public UserAlreadyExistsException(string message) : base(message) { }

    }

    public class UserNotFoundException : Exception
    {
        public UserNotFoundException (string message) : base(message) { }
    }

    public class UserRepository : IUserRepository
    {
        private readonly UserDatabaseContext _databaseContext;
        private readonly IUserRepository _userRepository;
        private PasswordHasher _passwordHasher;

        public UserRepository (UserDatabaseContext databaseContext, IUserRepository userRepository, PasswordHasher passwordHasher)
        {
            _databaseContext = databaseContext;
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }


        public async Task<bool> ValidateUserExist(string email)
        {
            return await _databaseContext.Users.AnyAsync(x => x.Email == email);
        }
        public async Task<User> CreateUserAsync(User user)
        {
            if (await ValidateUserExist(user.Email))
                throw new UserAlreadyExistsException("User already exists");

            _databaseContext.Users.Add(user);
            await _databaseContext.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _databaseContext.Users.FindAsync(id);
            if (user != null)
            {
                _databaseContext.Remove(user);
                var result = await _databaseContext.SaveChangesAsync();
                return result > 0 ? true : false;
            }

            return false;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _databaseContext.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
                throw new UserNotFoundException("User not found");
            
            return user;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _databaseContext.Users.FindAsync(id);
            if (user == null)
                throw new UserNotFoundException("User not found");

            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            var existingUser = await _databaseContext.Users.FindAsync(user.Id);
            if (existingUser == null)
                throw new UserNotFoundException("User not found");

            bool hasChanges = false;

            if (!string.Equals(existingUser.FullName, user.FullName, StringComparison.Ordinal) || user.FullName != string.Empty)
            {
                existingUser.FullName = user.FullName;
                hasChanges = true;
            }
                
            if (!string.Equals(existingUser.Password, user.Password, StringComparison.Ordinal) || user.Password != string.Empty)
            {
                existingUser.Password = user.Password;
                hasChanges = true;
            }

            if (!string.Equals(existingUser.LanguagePreference, user.LanguagePreference, StringComparison.Ordinal) || user.LanguagePreference != string.Empty)
            {
                existingUser.LanguagePreference = user.LanguagePreference;
                hasChanges = true;
            }
                
            if (hasChanges)
            {
                await _databaseContext.SaveChangesAsync();
                return user;
            }

            return user;
        }
    }
}
