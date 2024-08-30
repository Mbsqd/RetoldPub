using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts
{
    public class UpdateDescriptionBlockRequest
    {
        [Required(ErrorMessage = "Description can't be empty")]
        [MaxLength(Block.MAX_DESCRIPTION_LENGTH, ErrorMessage = "Name cannot be longer than " + "256" + " characters")]
        public string newDescription { get; set; } = string.Empty;
    }
}
