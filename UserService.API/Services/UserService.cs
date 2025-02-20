using AuthService.Infrastructure.SecurityCrypto;
using AutoMapper;
using UserService.API.DTOs;
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

        public Task<bool> DeleteUserAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<UserDTO> GetUserByEmailAsync(string email)
        {
            throw new NotImplementedException();
        }

        public Task<UserDTO> GetUserByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<UserDTO> UpdateUserAsync(UserUpdateDTO userUpdateDTO)
        {
            throw new NotImplementedException();
        }
    }
}
