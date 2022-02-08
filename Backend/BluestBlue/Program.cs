using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pomelo.EntityFrameworkCore.MySql;
using Microsoft.EntityFrameworkCore.Design;
using MySql.EntityFrameworkCore.Extensions;
using Microsoft.AspNetCore.Cors;
using BluestBlue.Models;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://bluestblue.co.uk")
            .AllowAnyMethod()
            .AllowAnyHeader();
        }
    );
});

builder.Services.AddDbContext<BlueBlueContext>(b =>
{
    string connectionString = builder.Environment.IsDevelopment() ?
        "DefaultConnection" :
        "ProductionConnection";
    b.UseMySql(
        builder.Configuration.GetConnectionString(connectionString),
        new MySqlServerVersion(new Version(5, 7, 31))
    );
});

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (!app.Environment.IsDevelopment()) {
    app.UseHttpsRedirection();
}

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
