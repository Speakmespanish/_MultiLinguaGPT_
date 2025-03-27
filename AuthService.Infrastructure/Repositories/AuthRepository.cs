using AuthService.Core.Entities;
using AuthService.Core.Interfaces;
using AuthService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthService.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {

        private readonly AuthDbContext _context;

        public AuthRepository(AuthDbContext context)
        {
            _context = context;
        }



        public async Task<RefreshToken> AddRefreshTokenAsync(RefreshToken token)
        {
            await _context.AddAsync(token);
            await _context.SaveChangesAsync();

            return token;
        }

        public async Task<RefreshToken> GetRefreshTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
                throw new ArgumentNullException(nameof(token));

            var tokenReturned = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == token);

            if (tokenReturned == null)
                throw new ArgumentNullException(nameof(token));

            return tokenReturned;
        }

        public Task<bool> MarkRefreshTokenAsUsedAsync(RefreshToken token)
        {
            throw new NotImplementedException();
        }
    }
}
