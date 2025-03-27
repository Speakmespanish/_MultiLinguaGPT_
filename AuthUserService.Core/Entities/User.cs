using AuthUserService.Core.Enums;

namespace AuthUserService.Core.Entities
{
   public class User
    {
        public int UsuarioId { get; set; }
        public required string Nombre { get; set; }
        public required string Correo { get; set; }
        public required string Clave { get; set; }
        public string? idioma_preferido { get; set; }
        public required UserType tipo_usuario { get; set; }
    }
}
