using retold_server.domain.Abstractions;
using retold_server.domain.DTO;
using retold_server.domain.Models;

namespace retold_server.application.Services
{
    public class BlocksService : IBlocksService
    {
        private readonly IBlocksRepository blocksRepository;
        private readonly ISchedulesRepository schedulesRepository;
        private readonly IConsultationsRepository consultationsRepository;

        public BlocksService(IBlocksRepository blocksRepository, ISchedulesRepository schedulesRepository, IConsultationsRepository consultationsRepository)
        {
            this.blocksRepository = blocksRepository;
            this.schedulesRepository = schedulesRepository;
            this.consultationsRepository = consultationsRepository;
        }

        public async Task<List<BlocksDto>> GetAllBlockByUserId(int userId)
        {
            var blocks = await this.blocksRepository.GetAllByUserId(userId);

            var blockDtos = blocks.Select(b => new BlocksDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
            }).ToList();

            return blockDtos;
        }

        public async Task<BlockDto?> GetBlockById(int id, int userId)
        {
            var block = await this.blocksRepository.GetById(id, userId);
            if (block == null || block.UserId != userId) { return null; }

            var blockDto = new BlockDto
            {
                Title = block.Title,
                Description = block.Description,
                Schedules = block.Schedules.Select(s => new ScheduleDto
                {
                    Id = s.Id,
                    TypeWeek = s.TypeWeek,
                    Day = s.Day,
                    TimeStart = s.TimeStart,
                    TimeEnd = s.TimeEnd,
                    Title = s.Title,
                    LessonType = s.LessonType,
                    Cabinet = s.Cabinet,
                    LinkFirst = s.LinkFirst,
                    LinkSecond = s.LinkSecond
                }).ToList(),
                Consultations = block.Consultations.Select(c => new ConsultationDto
                {
                    Title = c.Title,
                    TeachersName = c.TeacherName,
                    Day = c.Day,
                    TimeStart = c.TimeStart,
                    Cabinet = c.Cabinet,
                    Link = c.Link
                }).ToList()
            };

            return blockDto;
        }

        public async Task<int> CreateBlock(int userId, string title, string description)
        {
            var block = new Block(userId, title, description);
            return await this.blocksRepository.Create(block);
        }

        public async Task<string?> UpdateTitleBlock(int blockId, int userId, string newTitle)
        {
            var result = await this.blocksRepository.UpdateTitle(blockId, userId, newTitle);
            if (result == null) { return null; }
            return result;
        }

        public async Task<string?> UpdateDescriptionBlock(int blockId, int userId, string newDescription)
        {
            var result = await this.blocksRepository.UpdateDescription(blockId, userId, newDescription);
            if (result == null) { return null; }
            return result;
        }

        public async Task<bool?> DeleteBlock(int id, int userId)
        {
            return await this.blocksRepository.Delete(id, userId);
        }

        public async Task<List<ScheduleDto>> GetAllSchedules(int blockId, int userId)
        {
            var schedules = await this.schedulesRepository.GetAllByBlockId(blockId, userId);

            var schedulesDto = schedules.Select(s => new ScheduleDto
            {
                Id = s.Id,
                TypeWeek = s.TypeWeek,
                Day = s.Day,
                TimeStart = s.TimeStart,
                TimeEnd = s.TimeEnd,
                Title = s.Title,
                LessonType = s.LessonType,
                Cabinet = s.Cabinet,
                LinkFirst = s.LinkFirst,
                LinkSecond = s.LinkSecond
            }).ToList();

            return schedulesDto;
        }

        public async Task<bool> AddScheduleToBlock(int blockId, int userId, Schedule schedule)
        {
            return await this.blocksRepository.AddScheduleToBlock(blockId, userId, schedule);
        }

        public async Task<bool> UpdateSchedule(int userId, Schedule schedule)
        {
            return await this.blocksRepository.UpdateSchedule(userId, schedule);
        }

        public async Task<bool> DeleteSchedule(int scheduleId, int blockId, int userId)
        {
            return await this.blocksRepository.DeleteSchedule(scheduleId, blockId, userId);
        }

        public async Task<List<ConsultationDto>> GetAllConsultations(int blockId, int userId)
        {
            var consultations = await this.consultationsRepository.GetAllByBlockId(blockId, userId);

            var consultationsDto = consultations.Select(c => new ConsultationDto
            {
                Id = c.Id,
                Title = c.Title,
                TeachersName = c.TeacherName,
                Day = c.Day,
                TimeStart = c.TimeStart,
                Cabinet = c.Cabinet,
                Link = c.Link
            }).ToList();

            return consultationsDto;
        }

        public async Task<bool> AddConsultationToBlock(int blockId, int userId, Consultation consultation)
        {
            return await this.blocksRepository.AddConsultationToBlock(blockId, userId, consultation);
        }

        public async Task<bool> UpdateConsultation(int userId, Consultation consultation)
        {
            return await this.blocksRepository.UpdateConsultation(userId, consultation);
        }

        public async Task<bool> DeleteConsultation(int consultationId, int blockId, int userId)
        {
            return await this.blocksRepository.DeleteConsultation(consultationId, blockId, userId); 
        }
    }
}
