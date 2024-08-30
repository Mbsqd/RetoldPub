namespace retold_server.domain.DTO
{
    public class ScheduleDto
    {
        public int Id { get; set; }
        public int TypeWeek { get; set; }
        public int Day { get; set; }
        public TimeOnly TimeStart { get; set; }
        public TimeOnly TimeEnd { get; set; }
        public string Title { get; set; } = string.Empty;
        public string LessonType { get; set; } = string.Empty;
        public string Cabinet { get; set; } = string.Empty;
        public string LinkFirst { get; set; } = string.Empty;
        public string LinkSecond { get; set; } = string.Empty;
    }
}
