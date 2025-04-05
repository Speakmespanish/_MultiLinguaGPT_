using AuthUserService.Api.Custom;
using AuthUserService.Api.Data;
using AuthUserService.Api.DTOs;
using AuthUserService.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthUserService.Api.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AccessController : ControllerBase
    {
        private readonly DbAuthContext _context;
        private readonly Utilities _utilities;
        public AccessController(DbAuthContext context, Utilities utilities)
        {
            _context = context;
            _utilities = utilities;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register (UserDTO user)
        {
            var userModel = new User
            {
                Nombre = user.Name,
                Correo = user.Email,
                Clave = _utilities.SHA256Encrypter(user.Password),
                idioma_preferido = user.Languaje ?? "es-es",
                tipo_usuario = 0
            };

            _context.Usuarios.Add(userModel);
            await _context.SaveChangesAsync();

            if (userModel.UsuarioId != 0)
                return StatusCode(StatusCodes.Status201Created, new { issuccess = true });
            else
                return StatusCode(StatusCodes.Status400BadRequest, new { issuccess = false });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginDTO user)
        {
            var recoveredUser = await _context.Usuarios
                .Where(x => 
                    string.Equals(x.Correo, x.Correo) && 
                    string.Equals(x.Clave, _utilities.SHA256Encrypter(user.Password)))
                .FirstOrDefaultAsync();

            if (recoveredUser == null)
                return StatusCode(StatusCodes.Status400BadRequest, new { issuccess = false, token = "" });
            else
                return StatusCode(StatusCodes.Status200OK, new { issuccess = true, token = _utilities.GenerateJWT(recoveredUser)});
        }
    }
}
