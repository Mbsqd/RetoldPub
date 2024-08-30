using retold_server.domain.Models;

namespace retold_server.application.Interfaces.Auth
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}