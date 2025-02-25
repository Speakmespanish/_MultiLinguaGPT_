using System;
using System.Text.Json;
using System.Threading.Tasks;
using DataService.Core.Models;
using DataService.Core.Clients;
using System.Net.Http;


namespace DataService.Core.Services
{
    public class CinemaService : ICinemaService
    {
        private readonly ICinemaApiClient _cinemaApiClient;

        public CinemaService(ICinemaApiClient cinemaApiClient)
        {
            _cinemaApiClient = cinemaApiClient;
        }
        public async Task<Movie> GetMovieByTitleAsync(string title)
        {
            return await _cinemaApiClient.GetMovieByTitleAsync(title);
        }
    }
}
