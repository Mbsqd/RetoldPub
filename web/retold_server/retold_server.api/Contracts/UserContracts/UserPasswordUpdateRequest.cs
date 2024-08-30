using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.UserContracts
{
    public class UserPasswordUpdateRequest
    {
        [Required(ErrorMessage = "Old password can't be empty")]
        public string oldPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "New password can't be empty")]
        [MinLength(User.MIN_PASSWORD_LENGTH, ErrorMessage = "Password must be at least " + "8" + " characters long")]
        [MaxLength(User.MAX_FIELD_LENGTH, ErrorMessage = "Password cannot be longer than " + "64" + " characters")]
        public string newPassword { get; set; } = string.Empty;
    }
}
