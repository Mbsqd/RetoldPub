using Microsoft.EntityFrameworkCore;
using retold_server.data_access.Entities;
using retold_server.domain.Abstractions;
using retold_server.domain.Models;

namespace retold_server.data_access.Repositories
{
    public class ConsultationsRepository : IConsultationsRepository
    {
        private readonly RetoldDbContext context;

        public ConsultationsRepository(RetoldDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Consultation>> GetAllByBlockId(int blockId, int userId)
        {
            var consultationEntities = await this.context.Consultations
                .AsNoTracking()
                .Where(c => c.BlockId == blockId && c.Block.UserId == userId)
                .ToListAsync();

            var consultations = consultationEntities.Select(c =>
            {
                var consultation = new Consultation(
                    c.Id,
                    c.BlockId,
                    c.Title,
                    c.TeacherName,
                    c.Day,
                    c.TimeStart,
                    c.Cabinet,
                    c.Link
                );

                return consultation;
            }).ToList();

            return consultations;
        }

        public async Task<Consultation?> GetById(int id)
        {
            var consultationEntity = await this.context.Consultations
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
            if (consultationEntity == null) { return null; }

            var consultation = new Consultation(
            consultationEntity.Id,
            consultationEntity.BlockId,
            consultationEntity.Title,
            consultationEntity.TeacherName,
            consultationEntity.Day,
            consultationEntity.TimeStart,
            consultationEntity.Cabinet,
            consultationEntity.Link
            );

            return consultation;
        }

        public async Task<Consultation> Create(Consultation consultation)
        {
            var consultationEntity = new ConsultationEntity
            {
                Id = consultation.Id,
                BlockId = consultation.BlockId,
                Title = consultation.Title,
                TeacherName = consultation.TeacherName,
                Day = consultation.Day,
                TimeStart = consultation.TimeStart,
                Cabinet = consultation.Cabinet,
                Link = consultation.Link
            };

            await this.context.Consultations.AddAsync(consultationEntity);
            await this.context.SaveChangesAsync();

            return consultation;
        }

        public async Task<Consultation?> Update(Consultation consultation)
        {
            int affectedRow = await this.context.Consultations
            .Where(u => u.Id == consultation.Id)
            .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.Title, consultation.Title)
            .SetProperty(b => b.TeacherName, consultation.TeacherName)
            .SetProperty(b => b.Day, consultation.Day)
            .SetProperty(b => b.TimeStart, consultation.TimeStart)
            .SetProperty(b => b.Cabinet, consultation.Cabinet)
            .SetProperty(b => b.Link, consultation.Link));

            if (affectedRow == 0) { return null; }

            return consultation;
        }

        public async Task<bool?> Delete(int id)
        {
            var affectedRow = await this.context.Consultations
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();
            if (affectedRow == 0) { return null; }

            return true;
        }
    }
}
