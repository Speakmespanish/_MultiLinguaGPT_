using DataService.Core.Clients;
using DataService.Core.Services;
using DataService.Core.Models;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddHttpClient<ICinemaApiClient, CinemaApiClient>(client =>
{
    client.BaseAddress = new Uri("http://www.omdbapi.com/");
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<ICinemaApiClient, CinemaApiClient>();
builder.Services.AddScoped<ICinemaService, CinemaService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
