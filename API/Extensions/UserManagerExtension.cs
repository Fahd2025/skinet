using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindUserByClaimsPrincipalWithAddressAsync(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            var email = user?.Claims?.FirstOrDefault(x=> x.Type == ClaimTypes.Email)?.Value;

            return await input.Users.Include(m=> m.Address).SingleOrDefaultAsync(x=> x.Email == email);
        }


        public static async Task<AppUser> FindUserByClaimsPrincipalAsync(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            var email = user?.Claims?.FirstOrDefault(x=> x.Type == ClaimTypes.Email)?.Value;

            return await input.Users.SingleOrDefaultAsync(x=> x.Email == email);
        }
    }
}