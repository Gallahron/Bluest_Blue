using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using MySql.Data.MySqlClient;

namespace BluestBlue.Models
{
    public class BlueBlueContext : DbContext
    {
        public BlueBlueContext(DbContextOptions<BlueBlueContext> options)
            : base(options)
        {
        }

        public DbSet<Colour> Colours { get; set; } = null!;
    }
}
