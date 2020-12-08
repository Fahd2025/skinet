using System;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                var env = services.GetRequiredService<IWebHostEnvironment>();
                try
                {
                    var context = services.GetRequiredService<StoreContext>();
                    await context.Database.MigrateAsync();

                    string seedDataPath = "wwwroot/SeedData/";
                    if (env.IsDevelopment())
                    {
                        seedDataPath = "../Infrastructure/Data/SeedData/";
                    }                    
                    await StoreContextSeed.SeedAsync(context,seedDataPath, loggerFactory);
                }
                catch (Exception ex)
                {                    
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex,"an error occured during migration");
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
