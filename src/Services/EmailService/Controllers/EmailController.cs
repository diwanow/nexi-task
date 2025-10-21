using MediatR;
using Microsoft.AspNetCore.Mvc;
using EmailService.Application.Email.Commands.SendMonthlyReport;

namespace EmailService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmailController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Send monthly report email
    /// </summary>
    [HttpPost("monthly-report")]
    public async Task<ActionResult<bool>> SendMonthlyReport(SendMonthlyReportCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Send test email
    /// </summary>
    [HttpPost("test")]
    public async Task<ActionResult> SendTestEmail([FromBody] TestEmailRequest request)
    {
        // Implementation would go here
        return Ok();
    }
}

public record TestEmailRequest
{
    public string Email { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
}
