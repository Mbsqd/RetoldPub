
using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.domain.Abstractions
{
    public interface IUsersService
    {
        Task<UserDto?> GetUserById(int id);
        Task<User?> GetUserByEmail(string email);
        Task<(int? UserId, string? ErrorMessage)> Register(string username, string email, string password);
        Task<string?> Login(string email, string password);
        Task<(string? ReturnUsername, string? ErrorMessage)> UpdateUsername(int id, string newUsername);
        Task<(string? ReturnEmail, string? ErrorMessage)> UpdateEmail(int id, string newEmail);
        Task<(Guid? ReturnTelegramUsername, string? ErrorMessage)> UpdateTelegramCode(int id);
        Task<bool> UpdateUserPassword(int id, string oldPassword, string newPassword);
    }
}