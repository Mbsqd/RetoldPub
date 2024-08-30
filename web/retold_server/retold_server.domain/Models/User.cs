namespace retold_server.domain.Models
{
    public class User
    {
        public const int MAX_FIELD_LENGTH = 64;
        public const int MIN_PASSWORD_LENGTH = 8;

        public User(string username, string email, string hashedPassword)
        {
            Username = username;
            Email = email;
            HashedPassword = hashedPassword;
            TelegramCode = Guid.NewGuid();
            Blocks = new List<Block>();
        }

        public User(int id, string username, string email, string hashedPassword, Guid telegramCode)
        {
            Id = id;
            Username = username;
            Email = email;
            HashedPassword = hashedPassword;
            TelegramCode = telegramCode;
            Blocks = new List<Block>();
        }

        public int Id { get; set; }
        public string Username { get; } = string.Empty;
        public string Email { get; } = string.Empty;
        public string HashedPassword { get; } = string.Empty;
        public Guid TelegramCode { get; }

        public ICollection<Block> Blocks { get; set; } = new List<Block>();
    }
}
