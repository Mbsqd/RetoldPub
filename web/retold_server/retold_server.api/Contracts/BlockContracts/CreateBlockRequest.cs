using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts
{
    public class CreateBlockRequest
    {
        [Required(ErrorMessage = "Title can't be empty")]
        [MaxLength(Block.MAX_FIELD_LENGTH, ErrorMessage = "Title cannot be longer than " + "64" + " characters")]
        public string Title { get; set; } = string.Empty;

        [MaxLength(Block.MAX_DESCRIPTION_LENGTH, ErrorMessage = "Title cannot be longer than " + "256" + " characters")]
        public string Description { get; set; } = string.Empty;
    }
}
