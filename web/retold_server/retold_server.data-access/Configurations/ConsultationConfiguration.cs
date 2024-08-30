using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using retold_server.data_access.Entities;
using retold_server.domain.Models;

namespace retold_server.data_access.Configurations
{
    public class ConsultationConfiguration : IEntityTypeConfiguration<ConsultationEntity>
    {
        public void Configure(EntityTypeBuilder<ConsultationEntity> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(Consultation.MAX_FIELD_LENGTH);

            builder.Property(c => c.TeacherName)
                .IsRequired()
                .HasMaxLength(Consultation.MAX_FIELD_LENGTH);

            builder.Property(c => c.Day)
                .IsRequired()
                .HasMaxLength(Consultation.MAX_FIELD_LENGTH);

            builder.Property(c => c.Cabinet)
                .HasMaxLength(Consultation.MAX_CABINET_LENGTH);

            builder.Property(c => c.Link)
                .HasMaxLength(Consultation.MAX_LINK_LENGTH);

            builder.HasOne(c => c.Block)
                .WithMany(b => b.Consultations)
                .HasForeignKey(c => c.BlockId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
