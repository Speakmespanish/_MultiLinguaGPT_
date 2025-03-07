using AuthService.Infrastructure.SecurityCrypto;
using AutoMapper;
using UserService.API.DTOs;
using UserService.API.Exceptions;
using UserService.API.Interfaces;
using UserService.Core.Entities;
using UserService.Core.Interfaces.Repositories;

namespace UserService.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private PasswordHasher PasswordHasher = new PasswordHasher();

        public UserService (IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }




        public async Task<UserDTO> CreateUserAsync(UserCreateDTO userCreateDTO)
        {
            try
            {
                userCreateDTO.Password = PasswordHasher.HashPassword(userCreateDTO.Password);
                var userMapped = _mapper.Map<User>(userCreateDTO);

                var userReturned = await _userRepository.CreateUserAsync(userMapped);
                var userDTOReturned = _mapper.Map<UserDTO>(userReturned);

                return userDTOReturned;
            }
            catch (Exception ex)
            {
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            if (id <= 0)
                throw new InvalidFieldProvidedException("ID");

            bool result = await _userRepository.DeleteUserAsync(id);
            return result;
        }

        public async Task<UserDTO> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new InvalidFieldProvidedException("Email");

            var userResult = await _userRepository.GetUserByEmailAsync(email);

            if (userResult != null)
            {
                var userToMap = _mapper.Map<UserDTO>(userResult);
                return userToMap;
            }

            throw new InvalidUserException("User not found by Email provided");
        }

        public async Task<UserDTO> GetUserByIdAsync(int id)
        {
            if (id <= 0)
                throw new InvalidFieldProvidedException("ID");

            var userResult = await _userRepository.GetUserByIdAsync(id);

            if (userResult != null)
            {
                var userToMap = _mapper.Map<UserDTO>(userResult);
                return userToMap;
            }

            throw new InvalidUserException("User not found by ID provided");
        }

        public async Task<UserDTO> UpdateUserAsync(UserUpdateDTO userUpdateDTO)
        {
            if (userUpdateDTO == null)
                throw new InvalidUserException("User provided is null");
            if (string.IsNullOrEmpty(userUpdateDTO.FullName))
                throw new InvalidFieldProvidedException("Username is empty");
            if (string.IsNullOrEmpty(userUpdateDTO.Password))
                throw new InvalidFieldProvidedException("Password is empty");


            bool hasChanges = false;
            var existingUser = await _userRepository.GetUserByIdAsync(userUpdateDTO.Id);
            if (existingUser == null)
                throw new InvalidUserException("User not found");



            if (!string.Equals(existingUser.FullName, userUpdateDTO.FullName, StringComparison.Ordinal) || userUpdateDTO.FullName != string.Empty)
            {
                existingUser.FullName = userUpdateDTO.FullName;
                hasChanges = true;
            }

            if (!string.Equals(existingUser.Password, userUpdateDTO.Password, StringComparison.Ordinal) || userUpdateDTO.Password != string.Empty)
            {
                existingUser.Password = userUpdateDTO.Password;
                hasChanges = true;
            }

            if (!string.Equals(existingUser.LanguagePreference, userUpdateDTO.LanguagePreference, StringComparison.Ordinal) || userUpdateDTO.LanguagePreference != string.Empty)
            {
                existingUser.LanguagePreference = userUpdateDTO.LanguagePreference;
                hasChanges = true;
            }

            if (!hasChanges)   
                throw new NoChangesObjectException("Theren't any change in the user entity");

            var userReturned = await _userRepository.UpdateUserAsync(existingUser);
            return _mapper.Map<UserDTO>(userReturned);
        }
    }
}
