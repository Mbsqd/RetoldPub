namespace retold_server.domain.Models
{
    public class Block
    {
        public const int MAX_FIELD_LENGTH = 64;
        public const int MAX_DESCRIPTION_LENGTH = 256;

        public Block(int userId, string title, string description)
        {
            UserId = userId;
            Title = title;
            Description = description;
        }

        public Block(int id, int userId, string title, string description, string chatsId)
        {
            Id = id;
            UserId = userId;
            Title = title;
            Description = description;
            ChatsId = chatsId;
        }

        public int Id { get; }
        public int UserId { get; }
        public string Title { get; } = string.Empty;
        public string Description { get; } = string.Empty;
        public string ChatsId { get; } = string.Empty;

        public User? User { get; }

        public ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}
