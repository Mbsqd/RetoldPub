using Microsoft.EntityFrameworkCore;
using retold_server.data_access.Entities;

namespace retold_server.data_access
{
    public class RetoldDbContext : DbContext
    {
        public RetoldDbContext(DbContextOptions<RetoldDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<BlockEntity> Blocks { get; set; }
        public DbSet<ScheduleEntity> Schedules { get; set; }
        public DbSet<ConsultationEntity> Consultations { get; set; }
    }
}
