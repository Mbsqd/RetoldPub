using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using retold_server.data_access.Entities;
using retold_server.domain.Models;

namespace retold_server.data_access.Configurations
{
    public class ScheduleConfiguration : IEntityTypeConfiguration<ScheduleEntity>
    {
        public void Configure(EntityTypeBuilder<ScheduleEntity> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.TypeWeek)
                .IsRequired()
                .HasMaxLength(Schedule.MAX_FIELD_LENGTH);

            builder.Property(s => s.Day)
                .IsRequired()
                .HasMaxLength(Schedule.MAX_FIELD_LENGTH);

            builder.Property(s => s.TimeStart)
                .IsRequired();

            builder.Property(s => s.TimeEnd)
                .IsRequired();

            builder.Property(s => s.Title)
                .IsRequired()
                .HasMaxLength(Schedule.MAX_FIELD_LENGTH);

            builder.Property(s => s.LessonType)
                .IsRequired()
                .HasMaxLength(Schedule.MAX_FIELD_LENGTH);

            builder.Property(s => s.Cabinet)
                .HasMaxLength(Schedule.MAX_CABINET_LENGTH);

            builder.Property(s => s.LinkFirst)
                .HasMaxLength(Schedule.MAX_LINK_LENGTH);

            builder.Property(s => s.LinkSecond)
                .HasMaxLength(Schedule.MAX_LINK_LENGTH);

            builder.HasOne(s => s.Block)
                .WithMany(b => b.Schedules)
                .HasForeignKey(s => s.BlockId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
