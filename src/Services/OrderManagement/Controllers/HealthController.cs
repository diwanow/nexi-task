using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace OrderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly HealthCheckService _healthCheckService;

    public HealthController(HealthCheckService healthCheckService)
    {
        _healthCheckService = healthCheckService;
    }

    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var healthReport = await _healthCheckService.CheckHealthAsync();
        
        var status = healthReport.Status == HealthStatus.Healthy ? "Healthy" : "Unhealthy";
        
        return Ok(new
        {
            Status = status,
            Timestamp = DateTime.UtcNow,
            Services = healthReport.Entries.Select(entry => new
            {
                Name = entry.Key,
                Status = entry.Value.Status.ToString(),
                Duration = entry.Value.Duration.TotalMilliseconds,
                Description = entry.Value.Description,
                Data = entry.Value.Data
            })
        });
    }
}
