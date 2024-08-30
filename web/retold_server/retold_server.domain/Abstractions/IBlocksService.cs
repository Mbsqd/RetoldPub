using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.domain.Abstractions
{
    public interface IBlocksService
    {
        Task<int> CreateBlock(int userId, string title, string description);
        Task<bool?> DeleteBlock(int id, int userId);
        Task<List<BlocksDto>> GetAllBlockByUserId(int userId);
        Task<BlockDto?> GetBlockById(int id, int userId);
        Task<string?> UpdateTitleBlock(int blockId, int userId, string newTitle);
        Task<string?> UpdateDescriptionBlock(int blockId, int userId, string newDescription);
        Task<List<ScheduleDto>> GetAllSchedules(int blockId, int userId);
        Task<bool> AddScheduleToBlock(int blockId, int userId, Schedule schedule);
        Task<bool> UpdateSchedule(int userId, Schedule schedule);
        Task<bool> DeleteSchedule(int scheduleId, int blockId, int userId);
        Task<List<ConsultationDto>> GetAllConsultations(int blockId, int userId);
        Task<bool> AddConsultationToBlock(int blockId, int userId, Consultation consultation);
        Task<bool> UpdateConsultation(int userId, Consultation consultation);
        Task<bool> DeleteConsultation(int consultationId, int blockId, int userId);
    }
}