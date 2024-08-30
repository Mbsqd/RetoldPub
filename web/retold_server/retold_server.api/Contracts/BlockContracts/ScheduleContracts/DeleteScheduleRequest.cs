using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts.ScheduleContracts
{
    public class DeleteScheduleRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
