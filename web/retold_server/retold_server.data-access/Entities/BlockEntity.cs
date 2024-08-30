namespace retold_server.data_access.Entities
{
    public class BlockEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ChatsId { get; set; } = string.Empty;

        public UserEntity User { get; set; }
        public ICollection<ScheduleEntity> Schedules { get; private set; } = new List<ScheduleEntity>();
        public ICollection<ConsultationEntity> Consultations { get; private set; } = new List<ConsultationEntity>();
    }
}
