namespace EmailService.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = true, CancellationToken cancellationToken = default);
    Task SendEmailWithAttachmentAsync(string to, string subject, string body, byte[] attachment, string attachmentName, string contentType, CancellationToken cancellationToken = default);
}
