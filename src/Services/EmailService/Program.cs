using Serilog;
using EmailService.Application;
using EmailService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/emailservice-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Application Services
builder.Services.AddApplication();

// Add Infrastructure Services
builder.Services.AddInfrastructure(builder.Configuration);

// Add Health Checks
builder.Services.AddHealthChecks()
    .AddRabbitMQ(builder.Configuration.GetConnectionString("RabbitMQ") ?? "amqp://localhost:5672");

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

try
{
    Log.Information("Starting Email Service");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Email Service terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
