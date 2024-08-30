using retold_server.domain.Models;

namespace retold_server.domain.Abstractions
{
    public interface IConsultationsRepository
    {
        Task<Consultation?> GetById(int id);
        Task<List<Consultation>> GetAllByBlockId(int blockId, int userId);
        Task<Consultation> Create(Consultation consultation);
        Task<Consultation?> Update(Consultation consultation);
        Task<bool?> Delete(int id);
    }
}