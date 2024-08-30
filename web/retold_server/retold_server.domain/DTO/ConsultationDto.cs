namespace retold_server.domain.DTO
{
    public class ConsultationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TeachersName { get; set; } = string.Empty;
        public int Day { get; set; }
        public TimeOnly TimeStart { get; set; }
        public string Cabinet { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
    }
}
