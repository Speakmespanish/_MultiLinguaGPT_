using Microsoft.AspNetCore.Mvc;
using DataService.Core.Services;
using DataService.Core.Models;
using System.Threading.Tasks;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DataService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CinemaController : ControllerBase
    {
        private readonly ICinemaService _cinemaService;
        public CinemaController(ICinemaService cinemaService)
        {
            _cinemaService = cinemaService;
        }


        // GET: api/<CinemaController>
        [HttpGet("movie")]
        public async Task<IActionResult> GetMovieByTitle([FromQuery] string title)
        {
            if (string.IsNullOrEmpty(title))
                return BadRequest("El título es necesario");

            var movie = await _cinemaService.GetMovieByTitleAsync(title);

            if (movie == null)                
                    return NotFound("No se encontró la película");
                
                return Ok(movie); 
        }
        
    }
}
