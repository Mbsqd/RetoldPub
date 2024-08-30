using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using retold_server.data_access.Entities;
using retold_server.domain.Models;

namespace retold_server.data_access.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(User.MAX_FIELD_LENGTH);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(User.MAX_FIELD_LENGTH);

            builder.Property(u => u.HashedPassword)
                .IsRequired()
                .HasMaxLength(User.MAX_FIELD_LENGTH);

            builder.Property(u => u.TelegramCode)
                .IsRequired()
                .HasMaxLength(User.MAX_FIELD_LENGTH);

            builder.HasMany(u => u.Blocks)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId);
        }
    }
}
