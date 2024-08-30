using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.BlockContracts
{
    public class UpdateTitleBlockRequest
    {
        [Required(ErrorMessage = "Title can't be empty")]
        [MaxLength(Block.MAX_FIELD_LENGTH, ErrorMessage = "Name cannot be longer than " + "64" + " characters")]
        public string newTitle {  get; set; } = string.Empty;
    }
}
