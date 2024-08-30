using Microsoft.EntityFrameworkCore;
using retold_server.data_access.Entities;
using retold_server.domain.Abstractions;
using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.data_access.Repositories
{
    public class SchedulesRepository : ISchedulesRepository
    {
        private readonly RetoldDbContext context;

        public SchedulesRepository(RetoldDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Schedule>> GetAllByBlockId(int blockId, int userId)
        {
            var scheduleEntity = await this.context.Schedules
                .AsNoTracking()
                .Where(s => s.BlockId == blockId && s.Block.UserId == userId)
                .ToListAsync();

            var schedules = scheduleEntity.Select(s =>
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

            return schedules;
        }

        public async Task<Schedule?> GetById(int id)
        {
            var scheduleEntity = await this.context.Schedules
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
            if (scheduleEntity == null) { return null; }

            var schedule = new Schedule(
                scheduleEntity.Id,
                scheduleEntity.BlockId,
                scheduleEntity.TypeWeek,
                scheduleEntity.Day,
                scheduleEntity.TimeStart,
                scheduleEntity.TimeEnd,
                scheduleEntity.Title,
                scheduleEntity.LessonType,
                scheduleEntity.Cabinet,
                scheduleEntity.LinkFirst,
                scheduleEntity.LinkSecond
            );

            return schedule;
        }

        public async Task<Schedule> Create(Schedule schedule)
        {
            var scheduleEntity = new ScheduleEntity
            {
                Id = schedule.Id,
                BlockId = schedule.BlockId,
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

            await this.context.Schedules.AddAsync(scheduleEntity);
            await this.context.SaveChangesAsync();

            return schedule;
        }

        public async Task<Schedule?> Update(Schedule schedule)
        {
            int affectedRow = await this.context.Schedules
                .Where(u => u.Id == schedule.Id)
                .ExecuteUpdateAsync(s => s
                .SetProperty(b => b.TypeWeek, schedule.TypeWeek)
                .SetProperty(b => b.Day, schedule.Day)
                .SetProperty(b => b.TimeStart, schedule.TimeStart)
                .SetProperty(b => b.TimeEnd, schedule.TimeEnd)
                .SetProperty(b => b.Title, schedule.Title)
                .SetProperty(b => b.LessonType, schedule.LessonType)
                .SetProperty(b => b.Cabinet, schedule.Cabinet)
                .SetProperty(b => b.LinkFirst, schedule.LinkFirst)
                .SetProperty(b => b.LinkSecond, schedule.LinkSecond));

            if (affectedRow == 0) { return null; }

            return schedule;
        }

        public async Task<bool?> Delete(int id)
        {
            var affectedRow = await this.context.Schedules
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();
            if (affectedRow == 0) { return null; }

            return true;
        }
    }
}
