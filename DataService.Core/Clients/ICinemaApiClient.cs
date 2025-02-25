using DataService.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Core.Clients
{
    public interface ICinemaApiClient
    {
        Task<Movie> GetMovieByTitleAsync(string title);
    }
}
