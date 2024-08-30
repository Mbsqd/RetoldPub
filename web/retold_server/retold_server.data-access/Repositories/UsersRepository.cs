using Microsoft.EntityFrameworkCore;
using retold_server.data_access.Entities;
using retold_server.domain.Abstractions;
using retold_server.domain.Models;

namespace retold_server.data_access.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly RetoldDbContext context;

        public UsersRepository(RetoldDbContext context)
        {
            this.context = context;
        }

        public async Task<int> Create(User user)
        {
            var userEntity = new UserEntity
            {
                Username = user.Username,
                Email = user.Email,
                HashedPassword = user.HashedPassword,
                TelegramCode = user.TelegramCode
            };

            await this.context.AddAsync(userEntity);
            await this.context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task<User?> GetById(int id)
        {
            var userEntity = await this.context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
            if (userEntity == null) { return null; }

            var user = new User(userEntity.Id, userEntity.Username, userEntity.Email, userEntity.HashedPassword, userEntity.TelegramCode);
            return user;
        }

        public async Task<User?> GetByEmail(string email)
        {
            var userEntity = await this.context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);
            if (userEntity == null) { return null; }

            var user = new User(userEntity.Id, userEntity.Username, userEntity.Email, userEntity.HashedPassword, userEntity.TelegramCode);
            return user;
        }

        public async Task<string?> UpdateName(int id, string newUsername)
        {
            int affectedRow = await this.context.Users
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(s => s
                .SetProperty(b => b.Username, newUsername));
            if (affectedRow == 0) { return null; }

            return newUsername;
        }

        public async Task<string?> UpdateEmail(int id, string newEmail)
        {
            int affectedRow = await this.context.Users
            .Where(u => u.Id == id)
            .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.Email, newEmail));
            if (affectedRow == 0) { return null; }

            return newEmail;
        }

        public async Task<Guid?> UpdateTelegramCode(int id)
        {
            Guid newTelegramCode = Guid.NewGuid();

            int affectedRow = await this.context.Users
            .Where(u => u.Id == id)
            .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.TelegramCode, newTelegramCode));
            if (affectedRow == 0) { return null; }

            return newTelegramCode;
        }

        public async Task<bool?> UpdatePassword(int id, string newHashedPassword)
        {
            int affectedRow = await this.context.Users
            .Where(u => u.Id == id)
            .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.HashedPassword, newHashedPassword));
            if (affectedRow == 0) { return null; }

            return true;
        }

        public async Task<bool?> Delete(int id)
        {
            var affectedRow = await this.context.Users
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();
            if (affectedRow == 0) { return null; }

            return true;
        }

        public async Task<bool> EmailExist(string email)
        {
            return await this.context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> UsernameExist(string username)
        {
            return await this.context.Users.AnyAsync(u => u.Username == username);
        }
    }
}
