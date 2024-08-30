using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.UserContracts
{
    public class UserEmailUpdateRequest 
    {
        [Required(ErrorMessage = "Email can't be empty")]
        [MaxLength(User.MAX_FIELD_LENGTH, ErrorMessage = "Email cannot be longer than " + "64" + " characters")]
        [EmailAddress(ErrorMessage = "Email format is invalid")]
        public string Email { get; set; } = string.Empty;
    }
}
