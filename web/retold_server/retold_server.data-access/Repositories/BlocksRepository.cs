using Microsoft.EntityFrameworkCore;
using retold_server.data_access.Entities;
using retold_server.domain.Abstractions;
using retold_server.domain.Models;

namespace retold_server.data_access.Repositories
{
    public class BlocksRepository : IBlocksRepository
    {
        private readonly RetoldDbContext context;

        public BlocksRepository(RetoldDbContext context)
        {
            this.context = context;
        }

        public async Task<int> Create(Block block)
        {
            var blockEntity = new BlockEntity
            {
                UserId = block.UserId,
                Title = block.Title,
                Description = block.Description,
            };

            await this.context.Blocks.AddAsync(blockEntity);
            await this.context.SaveChangesAsync();

            return blockEntity.Id;
        }

        public async Task<List<Block>> GetAllByUserId(int userId)
        {
            var blockEntities = await this.context.Blocks
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .Include(b => b.Schedules)
                .Include(b => b.Consultations)
                .ToListAsync();

            var blocks = blockEntities.Select(b =>
            {
                var block = new Block(
                    b.Id,
                    b.UserId,
                    b.Title,
                    b.Description,
                    b.ChatsId
                );

                var schedules = b.Schedules.Select(s =>
                {
                    var schedule = new Schedule(
                        s.Id,
                        s.BlockId,
                        s.TypeWeek,
                        s.Day,
                        s.TimeStart,
                        s.TimeEnd,
                        s.Title,
                        s.LessonType,
                        s.Cabinet,
                        s.LinkFirst,
                        s.LinkSecond
                        );

                    return schedule;
                }).ToList();

                var consultations = b.Consultations.Select(c =>
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

                block.Schedules = schedules;
                block.Consultations = consultations;

                return block;
            }).ToList();

            return blocks;
        }

        public async Task<Block?> GetById(int id, int userId)
        {
            var blockEntity = await this.context.Blocks
                .AsNoTracking()
                .Include(b => b.Schedules)
                .Include(b => b.Consultations)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (blockEntity == null) { return null; }

            var block = new Block(
                blockEntity.Id,
                blockEntity.UserId,
                blockEntity.Title,
                blockEntity.Description,
                blockEntity.ChatsId
            );

            var schedules = blockEntity.Schedules.Select(s =>
            {
                var shedule = new Schedule(
                    s.Id,
                    s.BlockId,
                    s.TypeWeek,
                    s.Day,
                    s.TimeStart,
                    s.TimeEnd,
                    s.Title,
                    s.LessonType,
                    s.Cabinet,
                    s.LinkFirst,
                    s.LinkSecond
                    );

                return shedule;
            }).ToList();

            var consultations = blockEntity.Consultations.Select(c =>
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

            block.Schedules = schedules;
            block.Consultations = consultations;

            return block;
        }

        public async Task<string?> UpdateTitle(int blockId, int userId, string newTitle)
        {
            int affectedRow = await this.context.Blocks
            .Where(u => u.Id == blockId && u.UserId == userId)
            .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.Title, newTitle));

            if (affectedRow == 0) { return null; }

            return newTitle;
        }

        public async Task<string?> UpdateDescription(int blockId, int userId, string newDescription)
        {
            int affectedRow = await this.context.Blocks
            .Where(u => u.Id == blockId && u.UserId == userId)
            .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.Description, newDescription));

            if (affectedRow == 0) { return null; }

            return newDescription;
        }

        public async Task<bool?> Delete(int id, int userId)
        {
            var affectedRow = await this.context.Blocks
            .Where(u => u.Id == id && u.UserId == userId)
            .ExecuteDeleteAsync();
            if (affectedRow == 0) { return null; }

            return true;
        }

        public async Task<bool> AddScheduleToBlock(int blockId, int userId, Schedule schedule)
        {
            var blockEntity = await this.context.Blocks
                .Include(b => b.Schedules)
                .FirstOrDefaultAsync(b => b.Id == blockId && b.UserId == userId);
            if (blockEntity == null) { return false; }

            var scheduleEntity = new ScheduleEntity
            {
                BlockId = blockId,
                TypeWeek = schedule.TypeWeek,
                Day = schedule.Day,
                TimeStart = schedule.TimeStart,
                TimeEnd = schedule.TimeEnd,
                Title = schedule.Title,
                LessonType = schedule.LessonType,
                Cabinet = schedule.Cabinet,
                LinkFirst = schedule.LinkFirst,
                LinkSecond = schedule.LinkSecond
            };

            blockEntity.Schedules.Add(scheduleEntity);
            await this.context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSchedule(int userId, Schedule schedule)
        {
            var scheduleEntity = await this.context.Schedules
                .FirstOrDefaultAsync(s => s.Id == schedule.Id && s.BlockId == schedule.BlockId && s.Block.UserId == userId);
            if (scheduleEntity == null) { return false; }
            
            scheduleEntity.TypeWeek = schedule.TypeWeek;
            scheduleEntity.Day = schedule.Day;
            scheduleEntity.TimeStart = schedule.TimeStart;
            scheduleEntity.TimeEnd = schedule.TimeEnd;
            scheduleEntity.Title = schedule.Title;
            scheduleEntity.LessonType = schedule.LessonType;
            scheduleEntity.Cabinet = schedule.Cabinet;
            scheduleEntity.LinkFirst = schedule.LinkFirst;
            scheduleEntity.LinkSecond = schedule.LinkSecond;

            await this.context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSchedule(int scheduleId, int blockId, int userId)
        {
            var scheduleEntity = await this.context.Schedules
                .FirstOrDefaultAsync(s => s.Id == scheduleId && s.BlockId == blockId && s.Block.UserId == userId);
            if (scheduleEntity == null) { return false; }

            this.context.Schedules.Remove(scheduleEntity);
            await this.context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddConsultationToBlock(int blockId, int userId, Consultation consultation)
        {
            var blockEntity = await this.context.Blocks
                .Include(b => b.Consultations)
                .FirstOrDefaultAsync(b => b.Id == blockId && b.UserId == userId);
            if (blockEntity == null) { return false; }

            var consultationEntity = new ConsultationEntity
            {
                BlockId = blockId,
                Title = consultation.Title,
                TeacherName = consultation.TeacherName,
                Day = consultation.Day,
                TimeStart = consultation.TimeStart,
                Cabinet = consultation.Cabinet,
                Link = consultation.Link
            };

            blockEntity.Consultations.Add(consultationEntity);
            await this.context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateConsultation(int userId, Consultation consultation)
        {
            var consultationEntity = await this.context.Consultations
                .FirstOrDefaultAsync(s => s.Id == consultation.Id && s.BlockId == consultation.BlockId && s.Block.UserId == userId);
            if (consultationEntity == null) { return false; }

            consultationEntity.Title = consultation.Title;
            consultationEntity.TeacherName = consultation.TeacherName;
            consultationEntity.Day = consultation.Day;
            consultationEntity.TimeStart = consultation.TimeStart;
            consultationEntity.Cabinet = consultation.Cabinet;
            consultationEntity.Link = consultation.Link;

            await this.context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteConsultation(int consultationId, int blockId, int userId)
        {
            var consultationEntity = await this.context.Consultations
                .FirstOrDefaultAsync(s => s.Id == consultationId && s.BlockId == blockId && s.Block.UserId == userId);
            if (consultationEntity == null) { return false; }

            this.context.Consultations.Remove(consultationEntity);
            await this.context.SaveChangesAsync();
            return true;
        }
    }
}
