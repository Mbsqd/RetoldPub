namespace retold_server.domain.DTO
{
    public class BlockDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<ScheduleDto> Schedules { get; set; } = new List<ScheduleDto>();
        public List<ConsultationDto> Consultations { get; set; } = new List<ConsultationDto>();
    }
}
