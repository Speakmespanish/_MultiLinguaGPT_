using Microsoft.EntityFrameworkCore;
using AuthUserService.Core.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using AuthUserService.Core.Enums;

namespace AuthUserService.Api.Data
{
    public class DbAuthContext : DbContext
    {
        public DbAuthContext(DbContextOptions options) : base(options)
        {
        }

        public virtual DbSet<User> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var converter = new EnumToStringConverter<UserType>();

            modelBuilder.Entity<User>(entity =>
            {
                // Setting Primary Key
                entity.HasKey(e => e.UsuarioId);

                // Setting Properties
                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Correo)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasIndex(e => e.Correo)
                    .IsUnique();

                entity.Property(e => e.Clave)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.idioma_preferido)
                    .HasMaxLength(50);

                entity.Property(e => e.tipo_usuario)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasConversion(converter);

                // Setting Restriction Check of Table
                entity.ToTable(t =>
                {
                    t.HasCheckConstraint("CK_User_TipoUsuario", "[tipo_usuario] IN ('cliente', 'administrador')");
                });
            });

            base.OnModelCreating(modelBuilder);
        }

    }
}
