using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using retold_server.application.Interfaces.Auth;
using retold_server.domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace retold_server.infrastructure
{
    public class JwtProvider : IJwtProvider
    {
        private readonly JwtOptions options;

        public JwtProvider(IOptions<JwtOptions> options)
        {
            this.options = options.Value;
        }

        public string GenerateToken(User user)
        {
            Claim[] claims = [new("UserId", user.Id.ToString())];

            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.options.SecretKey)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: this.options.Issuer,
                audience: this.options.Audience,
                claims: claims,
                signingCredentials: signingCredentials,
                expires: DateTime.UtcNow.AddMinutes(this.options.ExpiresMinutes));

            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
            return tokenValue;
        }

    }
}
