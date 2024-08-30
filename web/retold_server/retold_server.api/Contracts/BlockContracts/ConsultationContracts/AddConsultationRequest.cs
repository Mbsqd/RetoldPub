using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts.ConsultationContracts
{
    public class AddConsultationRequest
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(Consultation.MAX_FIELD_LENGTH, ErrorMessage = "Title cannot be longer than " + "64" + " characters")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(Consultation.MAX_FIELD_LENGTH, ErrorMessage = "Teacher name cannot be longer than " + "64" + " characters")]
        public string TeachersName {  get; set; } = string.Empty;

        [Required(ErrorMessage = "Day is required")]
        [Range(1, 7, ErrorMessage = "Day must be between 1 and 7")]
        public int Day { get; set; }

        [Required(ErrorMessage = "Time start is required")]
        public TimeOnly TimeStart { get; set; }

        [MaxLength(Schedule.MAX_CABINET_LENGTH, ErrorMessage = "Cabinet cannot be longer than " + "5" + " characters")]
        public string Cabinet { get; set; } = string.Empty;

        [MaxLength(Schedule.MAX_LINK_LENGTH, ErrorMessage = "Link cannot be longer than " + "256" + " characters")]
        public string Link {  get; set; } = string.Empty;
    }
}
