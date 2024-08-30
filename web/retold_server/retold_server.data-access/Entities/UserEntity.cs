namespace retold_server.data_access.Entities
{
    public class UserEntity
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string HashedPassword { get; set; } = string.Empty;
        public Guid TelegramCode { get; set; }

        public ICollection<BlockEntity> Blocks { get; private set; } = new List<BlockEntity>();
    }
}
