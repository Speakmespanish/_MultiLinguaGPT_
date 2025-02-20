using UserService.API.DTOs;

namespace UserService.API.Interfaces
{
    public interface IUserService
    {
        public Task<UserDTO> CreateUserAsync (UserCreateDTO userCreateDTO);
        public Task<UserDTO> GetUserByIdAsync (int id);
        public Task<UserDTO> GetUserByEmailAsync (string email);
        public Task<UserDTO> UpdateUserAsync (UserUpdateDTO userUpdateDTO);
        public Task<bool> DeleteUserAsync (int id);
    }
}
