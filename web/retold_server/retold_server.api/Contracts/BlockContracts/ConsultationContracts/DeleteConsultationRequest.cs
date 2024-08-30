using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts.ConsultationContracts
{
    public class DeleteConsultationRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
