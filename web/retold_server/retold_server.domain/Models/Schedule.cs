namespace retold_server.domain.Models
{
    public class Schedule
    {
        public const int MAX_FIELD_LENGTH = 64;
        public const int MAX_CABINET_LENGTH = 5;
        public const int MAX_LINK_LENGTH = 256;

        public Schedule(int id, int blockId, int typeWeek, int day, TimeOnly timeStart, TimeOnly timeEnd, string title, string lessonType, string cabinet, string linkFirst, string linkSecond)
        {
            Id = id;
            BlockId = blockId;
            TypeWeek = typeWeek;
            Day = day;
            TimeStart = timeStart;
            TimeEnd = timeEnd;
            Title = title;
            LessonType = lessonType;
            Cabinet = cabinet;
            LinkFirst = linkFirst;
            LinkSecond = linkSecond;
        }

        public int Id { get; }
        public int BlockId { get; }
        public int TypeWeek { get; }
        public int Day { get; }
        public TimeOnly TimeStart { get; }
        public TimeOnly TimeEnd { get; }
        public string Title { get; } = string.Empty;
        public string LessonType { get; } = string.Empty;
        public string Cabinet { get; } = string.Empty; // can be empty
        public string LinkFirst { get; } = string.Empty; // can be empty
        public string LinkSecond { get; } = string.Empty; // can be empty

        public Block? Block { get; set; }
    }
}
