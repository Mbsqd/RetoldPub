using static retold_server.domain.Models.Schedule;

namespace retold_server.data_access.Entities
{
    public class ScheduleEntity
    {
        public int Id { get; set; }
        public int BlockId { get; set; }

        public int TypeWeek { get; set; }
        public int Day { get; set; }

        public TimeOnly TimeStart { get; set; } 
        public TimeOnly TimeEnd { get; set; }
        public string Title { get; set; } = string.Empty;
        public string LessonType { get; set; } = string.Empty;
        public string Cabinet { get; set; } = string.Empty; // can be empty
        public string LinkFirst { get; set; } = string.Empty; // can be empty
        public string LinkSecond { get; set; } = string.Empty; // can be empty

        public BlockEntity Block { get; set; } = new BlockEntity();
    }
}
