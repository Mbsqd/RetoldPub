using retold_server.domain.Models;
using System.ComponentModel.DataAnnotations;

namespace retold_server.api.Contracts.UserContracts
{
    public class UserRegisterRequest
    {
        [Required(ErrorMessage = "Name can't be empty")]
        [MaxLength(User.MAX_FIELD_LENGTH, ErrorMessage = "Name cannot be longer than " + "64" + " characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email can't be empty")]
        [MaxLength(User.MAX_FIELD_LENGTH, ErrorMessage = "Email cannot be longer than " + "64" + " characters")]
        [EmailAddress(ErrorMessage = "Email format is invalid")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password can't be empty")]
        [MinLength(User.MIN_PASSWORD_LENGTH, ErrorMessage = "Password must be at least " + "8" + " characters long")]
        [MaxLength(User.MAX_FIELD_LENGTH, ErrorMessage = "Password cannot be longer than " + "64" + " characters")]
        public string Password { get; set; } = string.Empty;
    }
}
