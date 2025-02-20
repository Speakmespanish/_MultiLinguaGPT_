using Microsoft.EntityFrameworkCore;
using UserService.Core.Entities;

namespace UserService.Infrastructure.Data
{
    public class UserDatabaseContext : DbContext
    {
        public UserDatabaseContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        //Fluent API Configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(builder =>
            {
                //Setting Primary Key
                builder.HasKey(u => u.Id);

                //Setting Index
                builder.HasIndex(u => u.Email)
                    .IsUnique();

                //Users Properties Configuration    
                builder.Property(u => u.FullName)
                    .IsRequired()
                    .HasMaxLength(64)
                    .HasColumnType("VARCHAR");

                builder.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(128)
                    .HasColumnType("VARCHAR");

                builder.Property(u => u.Password)
                    .IsRequired()
                    .HasMaxLength(512)
                    .HasColumnType("VARCHAR");

                builder.Property(u => u.LanguagePreference)
                    .IsRequired(false)
                    .HasMaxLength(48)
                    .HasColumnType("VARCHAR");

                builder.Property(u => u.UserType)
                    .IsRequired()
                    .HasColumnType("INT");


            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
