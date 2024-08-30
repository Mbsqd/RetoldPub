using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts.ScheduleContracts
{
    public class UpdateScheduleRequest
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Type week is required")]
        [Range(0, 2, ErrorMessage = "Day must be between 0 and 2")]
        public int TypeWeek { get; set; }

        [Required(ErrorMessage = "Day is required")]
        [Range(1, 7, ErrorMessage = "Day must be between 1 and 7")]
        public int Day { get; set; }

        [Required(ErrorMessage = "Time start is required")]
        public TimeOnly TimeStart { get; set; }

        [Required(ErrorMessage = "Time end is required")]
        public TimeOnly TimeEnd { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(Schedule.MAX_FIELD_LENGTH, ErrorMessage = "Type week cannot be longer than " + "64" + " characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lesson type is required")]
        [MaxLength(Schedule.MAX_FIELD_LENGTH, ErrorMessage = "Type week cannot be longer than " + "64" + " characters")]
        public string LessonType { get; set; } = string.Empty;

        [MaxLength(Schedule.MAX_CABINET_LENGTH, ErrorMessage = "Type week cannot be longer than " + "5" + " characters")]
        public string Cabinet { get; set; } = string.Empty;

        [MaxLength(Schedule.MAX_LINK_LENGTH, ErrorMessage = "Type week cannot be longer than " + "256" + " characters")]
        public string LinkFirst { get; set; } = string.Empty;
        [MaxLength(Schedule.MAX_LINK_LENGTH, ErrorMessage = "Type week cannot be longer than " + "256" + " characters")]
        public string LinkSecond { get; set; } = string.Empty;
    }
}
