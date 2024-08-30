using retold_server.application.Interfaces.Auth;
using retold_server.domain.Abstractions;
using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.application.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository usersRepository;
        private readonly IPasswordHasher passwordHasher;
        private readonly IJwtProvider jwtProvider;

        public UsersService(IUsersRepository usersRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            this.usersRepository = usersRepository;
            this.passwordHasher = passwordHasher;
            this.jwtProvider = jwtProvider;
        }

        public async Task<UserDto?> GetUserById(int id)
        {
            var user = await this.usersRepository.GetById(id);
            if(user == null) { return null; }

            var userDto = new UserDto
            {
                Username = user.Username,
                Email = user.Email,
                TelegramCode = user.TelegramCode
            };

            return userDto;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await this.usersRepository.GetByEmail(email);
        }

        public async Task<(int? UserId, string? ErrorMessage)> Register(string username, string email, string password)
        {
            if (await this.usersRepository.EmailExist(email)) { return (null, "Email is already taken"); }
            if (await this.usersRepository.UsernameExist(username)) { return (null, "Name is already taken"); }

            var hashedPassword = this.passwordHasher.Generate(password);

            var user = new User(username, email, hashedPassword);
            var userId = await this.usersRepository.Create(user);
            return (userId, null);
        }

        public async Task<string?> Login(string email, string password)
        {
            var user = await this.usersRepository.GetByEmail(email);
            if (user == null) { return null; }

            bool result = this.passwordHasher.Verify(password, user.HashedPassword);
            if (result == false) { return null; }

            string token = this.jwtProvider.GenerateToken(user);
            return token;
        }

        public async Task<(string? ReturnUsername, string? ErrorMessage)> UpdateUsername(int id, string newUsername)
        {
            var user = await this.usersRepository.GetById(id);
            if (user == null) { return (null, "User not found"); }
            if (user.Username == newUsername) { return (null, "The new username cannot be the same as the current."); }

            if (await this.usersRepository.UsernameExist(newUsername)) { return (null, "Name is already taken"); }

            var returnUsername = await this.usersRepository.UpdateName(id, newUsername);
            if (returnUsername == null) { return (null, "User not found"); }

            return (returnUsername, null);
        }

        public async Task<(string? ReturnEmail, string? ErrorMessage)> UpdateEmail(int id, string newEmail)
        {
            var user = await this.usersRepository.GetById(id);
            if (user == null) { return (null, "User not found"); }
            if (user.Email == newEmail) { return (null, "The new email cannot be the same as the current."); }

            if (await this.usersRepository.EmailExist(newEmail)) { return (null, "Email is already taken"); }

            var returnEmail = await this.usersRepository.UpdateEmail(id, newEmail);
            if (returnEmail == null) { return (null, "User not found"); }

            return (returnEmail, null);
        }

        public async Task<(Guid? ReturnTelegramUsername, string? ErrorMessage)> UpdateTelegramCode(int id)
        {
            var user = await this.usersRepository.GetById(id);
            if (user == null) { return (null, "User not found"); }

            var returnTelegramCode = await this.usersRepository.UpdateTelegramCode(id);
            if (returnTelegramCode == null) { return (null, "User not found"); }

            return (returnTelegramCode, null);
        }

        public async Task<bool> UpdateUserPassword(int id, string oldPassword, string newPassword)
        {
            var user = await this.usersRepository.GetById(id);
            if (user == null) { return false; }

            bool resultVerify = this.passwordHasher.Verify(oldPassword, user.HashedPassword);
            if (resultVerify == false) { return false; }

            var hashedPassword = this.passwordHasher.Generate(newPassword);
            var resultUpdate = this.usersRepository.UpdatePassword(id, hashedPassword);
            if(resultUpdate == null) { return false; }

            return true;
        }
    }
}
