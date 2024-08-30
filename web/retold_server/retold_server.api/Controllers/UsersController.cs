using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using retold_server.api.Contracts.UserContracts;
using retold_server.domain.Abstractions;

namespace retold_server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService usersService;

        public UsersController(IUsersService usersService)
        {
            this.usersService = usersService;
        }

        [Authorize]
        [HttpGet("get-user")]
        public async Task<IActionResult> GetUser()
        {
            var userIdClaim = HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userIdFromToken))
            {
                return Unauthorized();
            }

            var userDto = await this.usersService.GetUserById(userIdFromToken);
            if (userDto == null) { return NotFound("User not found"); } 

            return Ok(userDto);
        }

        [Authorize]
        [HttpPut("username")]
        public async Task<IActionResult> UpdateUsername([FromBody] UsernameUpdateRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdClaim = HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userIdFromToken))
            {
                return Unauthorized();
            }

            var (returnUsername, errorMessage) = await this.usersService.UpdateUsername(userIdFromToken, request.Username);
            if (returnUsername == null) { return BadRequest(errorMessage); }

            return Ok(returnUsername);
        }

        [Authorize]
        [HttpPut("email")]
        public async Task<IActionResult> UpdateUserEmail([FromBody] UserEmailUpdateRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdClaim = HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userIdFromToken))
            {
                return Unauthorized();
            }

            var (returnEmail, errorMessage) = await this.usersService.UpdateEmail(userIdFromToken, request.Email);
            if (returnEmail == null) { return BadRequest(errorMessage); }

            return Ok(returnEmail);
        }

        [Authorize]
        [HttpPut("telegram-code")]
        public async Task<IActionResult> UpdateTelegramCode()
        {
            var userIdClaim = HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userIdFromToken))
            {
                return Unauthorized();
            }

            var (returnTelegramCode, errorMessage) = await this.usersService.UpdateTelegramCode(userIdFromToken);
            if (returnTelegramCode == null) { return BadRequest(errorMessage); }

            return Ok(returnTelegramCode);
        }

        [Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> UpdateUserPassword([FromBody] UserPasswordUpdateRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var userIdClaim = HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userIdFromToken))
            {
                return Unauthorized();
            }

            var result = await this.usersService.UpdateUserPassword(userIdFromToken, request.oldPassword, request.newPassword); 
            if(result == false) { return BadRequest("Current password is incorrect"); }

            return Ok("Password has been successfully changed");
        }
    }
}
