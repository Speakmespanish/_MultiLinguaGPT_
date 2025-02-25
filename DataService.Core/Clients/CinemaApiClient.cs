using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using DataService.Core.Models;


namespace DataService.Core.Clients
{
    public class CinemaApiClient : ICinemaApiClient
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://www.omdbapi.com/?apikey=1af71ff7&t=";

        public CinemaApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Movie> GetMovieByTitleAsync(string title)
        {
            var response = await _httpClient.GetAsync($"{BaseUrl}{title}");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var movie = JsonSerializer.Deserialize<Movie>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return movie;
        }
    }
}
