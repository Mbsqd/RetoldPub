using retold_server.domain.Models;

namespace retold_server.domain.Abstractions
{
    public interface IUsersRepository
    {
        Task<User?> GetById(int id);
        Task<User?> GetByEmail(string email);
        Task<int> Create(User user);
        Task<string?> UpdateName(int id, string newUsername);
        Task<string?> UpdateEmail(int id, string newEmail);
        Task<Guid?> UpdateTelegramCode(int id);
        Task<bool?> UpdatePassword(int id, string newHashedPassword);
        Task<bool?> Delete(int id);
        Task<bool> EmailExist(string email);
        Task<bool> UsernameExist(string username);
    }
}