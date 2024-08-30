namespace retold_server.domain.Models
{
    public class Consultation
    {
        public const int MAX_FIELD_LENGTH = 64;
        public const int MAX_CABINET_LENGTH = 5;
        public const int MAX_LINK_LENGTH = 256;

        public Consultation(int id, int blockId, string title, string teacherName, int day, TimeOnly timeStart, string cabinet, string link)
        {
            Id = id;
            BlockId = blockId;
            Title = title;
            TeacherName = teacherName;
            Day = day;
            TimeStart = timeStart;
            Cabinet = cabinet;
            Link = link;
        }

        public int Id { get; }
        public int BlockId { get; }
        public string Title { get; } = string.Empty;
        public string TeacherName { get; } = string.Empty;
        public int Day { get; }
        public TimeOnly TimeStart { get; }
        public string Cabinet { get; } = string.Empty; // can be empty
        public string Link { get; } = string.Empty; // can be empty

        public Block? Block { get; set; }
    }
}
