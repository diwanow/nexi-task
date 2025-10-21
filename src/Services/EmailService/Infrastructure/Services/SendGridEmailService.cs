using EmailService.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailService.Infrastructure.Services;

public class SendGridEmailService : IEmailService
{
    private readonly ISendGridClient _sendGridClient;
    private readonly IConfiguration _configuration;

    public SendGridEmailService(ISendGridClient sendGridClient, IConfiguration configuration)
    {
        _sendGridClient = sendGridClient;
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true, CancellationToken cancellationToken = default)
    {
        var fromEmail = _configuration["SendGrid:FromEmail"] ?? "noreply@ecommerce.com";
        var fromName = _configuration["SendGrid:FromName"] ?? "E-Commerce System";

        var msg = new SendGridMessage
        {
            From = new EmailAddress(fromEmail, fromName),
            Subject = subject,
            PlainTextContent = isHtml ? null : body,
            HtmlContent = isHtml ? body : null
        };

        msg.AddTo(new EmailAddress(to));

        await _sendGridClient.SendEmailAsync(msg, cancellationToken);
    }

    public async Task SendEmailWithAttachmentAsync(string to, string subject, string body, byte[] attachment, string attachmentName, string contentType, CancellationToken cancellationToken = default)
    {
        var fromEmail = _configuration["SendGrid:FromEmail"] ?? "noreply@ecommerce.com";
        var fromName = _configuration["SendGrid:FromName"] ?? "E-Commerce System";

        var msg = new SendGridMessage
        {
            From = new EmailAddress(fromEmail, fromName),
            Subject = subject,
            HtmlContent = body
        };

        msg.AddTo(new EmailAddress(to));

        // Add attachment
        var attachmentBase64 = Convert.ToBase64String(attachment);
        msg.AddAttachment(attachmentName, attachmentBase64, contentType);

        await _sendGridClient.SendEmailAsync(msg, cancellationToken);
    }
}
