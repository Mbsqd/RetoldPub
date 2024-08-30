using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using retold_server.api.Contracts.UserContracts;
using retold_server.application.Interfaces.Auth;
using retold_server.domain.Abstractions;

namespace retold_server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorizationController : ControllerBase
    {
        private readonly IUsersService usersService;
        private readonly IUsersRepository usersRepository;
        private readonly IJwtProvider jwtProvider;

        public AuthorizationController(IUsersService usersService, IUsersRepository usersRepository, IJwtProvider jwtProvider)
        {
            this.usersService = usersService;
            this.usersRepository = usersRepository;
            this.jwtProvider = jwtProvider;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var (userId, errorMessage) = await this.usersService.Register(request.Name, request.Email, request.Password);
            if (!string.IsNullOrEmpty(errorMessage)) { return BadRequest(errorMessage); }

            return Ok(userId);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginRequest request)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var token = await this.usersService.Login(request.Email, request.Password);
            if(token == null) { return BadRequest("Invalid email or password"); }

            HttpContext.Response.Cookies.Append("app-cookie", token);
            return Ok(token);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await Task.Run(() =>
            {
                HttpContext.Response.Cookies.Delete("app-cookie");
            });

            return Ok("Successfuly logout");
        }
    }
}
