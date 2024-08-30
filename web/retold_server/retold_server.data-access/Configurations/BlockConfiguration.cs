using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using retold_server.data_access.Entities;
using retold_server.domain.Models;

namespace retold_server.data_access.Configurations
{
    public class BlockConfiguration : IEntityTypeConfiguration<BlockEntity>
    {
        public void Configure(EntityTypeBuilder<BlockEntity> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(Block.MAX_FIELD_LENGTH);

            builder.Property(b => b.Description)
                .HasMaxLength(Block.MAX_DESCRIPTION_LENGTH);

            builder.HasOne(b => b.User)
                .WithMany(u => u.Blocks)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(b => b.Schedules)
                .WithOne(s => s.Block)
                .HasForeignKey(s => s.BlockId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(b => b.Consultations)
                .WithOne(c => c.Block)
                .HasForeignKey(c => c.BlockId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
