using retold_server.domain.Models;

namespace retold_server.domain.Abstractions
{
    public interface IBlocksRepository
    {
        Task<List<Block>> GetAllByUserId(int userId);
        Task<Block?> GetById(int id, int userId);
        Task<int> Create(Block block);
        Task<string?> UpdateTitle(int blockId, int userId, string newTitle);
        Task<string?> UpdateDescription(int blockId, int userId, string newDescription);
        Task<bool?> Delete(int id, int userId);
        Task<bool> AddScheduleToBlock(int blockId, int userId, Schedule schedule);
        Task<bool> UpdateSchedule(int userId, Schedule schedule);
        Task<bool> DeleteSchedule(int scheduleId, int blockId, int userId);
        Task<bool> AddConsultationToBlock(int blockId, int userId, Consultation consultation);
        Task<bool> UpdateConsultation(int userId, Consultation consultation);
        Task<bool> DeleteConsultation(int consultationId, int blockId, int userId);
    }
}