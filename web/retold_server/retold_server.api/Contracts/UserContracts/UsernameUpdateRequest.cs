using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.UserContracts
{
    public class UsernameUpdateRequest
    {
        [Required(ErrorMessage = "Name can't be empty")]
        [MaxLength(User.MAX_FIELD_LENGTH, ErrorMessage = "Name cannot be longer than " + "64" + " characters")]
        public string Username { get; set; } = string.Empty;
    }
}
