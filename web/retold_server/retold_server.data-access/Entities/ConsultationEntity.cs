namespace retold_server.data_access.Entities
{
    public class ConsultationEntity
    {
        public int Id { get; set; }
        public int BlockId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public int Day { get; set; } 
        public TimeOnly TimeStart { get; set; } 
        public string Cabinet { get; set; } = string.Empty; // can be empty
        public string Link { get; set; } = string.Empty; // can be empty

        public BlockEntity Block { get; set; } = new BlockEntity();
    }
}
