using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.domain.Abstractions
{
    public interface ISchedulesRepository
    {
        Task<Schedule?> GetById(int id);
        Task<List<Schedule>> GetAllByBlockId(int blockId, int userId);
        Task<Schedule> Create(Schedule schedule);
        Task<Schedule?> Update(Schedule schedule);
        Task<bool?> Delete(int id);
    }
}