using MediatR;
using EmailService.Application.Common.Interfaces;

namespace EmailService.Application.Email.Commands.SendMonthlyReport;

public record SendMonthlyReportCommand : IRequest<bool>
{
    public string UserId { get; init; } = string.Empty;
    public string UserEmail { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public IList<TransactionDto> Transactions { get; init; } = new List<TransactionDto>();
    public DateTime ReportMonth { get; init; }
}

public class SendMonthlyReportCommandHandler : IRequestHandler<SendMonthlyReportCommand, bool>
{
    private readonly IEmailService _emailService;
    private readonly IPdfService _pdfService;

    public SendMonthlyReportCommandHandler(IEmailService emailService, IPdfService pdfService)
    {
        _emailService = emailService;
        _pdfService = pdfService;
    }

    public async Task<bool> Handle(SendMonthlyReportCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Generate PDF report
            var pdfBytes = await _pdfService.GenerateTransactionReportAsync(
                request.UserId, 
                request.Transactions, 
                cancellationToken);

            // Create email content
            var subject = $"Monthly Transaction Report - {request.ReportMonth:MMMM yyyy}";
            var body = CreateEmailBody(request.UserName, request.Transactions, request.ReportMonth);

            // Send email with PDF attachment
            await _emailService.SendEmailWithAttachmentAsync(
                request.UserEmail,
                subject,
                body,
                pdfBytes,
                $"transaction-report-{request.ReportMonth:yyyy-MM}.pdf",
                "application/pdf",
                cancellationToken);

            return true;
        }
        catch (Exception ex)
        {
            // Log error
            Console.WriteLine($"Error sending monthly report: {ex.Message}");
            return false;
        }
    }

    private static string CreateEmailBody(string userName, IList<TransactionDto> transactions, DateTime reportMonth)
    {
        var totalAmount = transactions.Sum(t => t.TotalAmount);
        var totalOrders = transactions.Count;

        return $@"
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .summary {{ background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }}
                </style>
            </head>
            <body>
                <div class='header'>
                    <h1>Monthly Transaction Report</h1>
                    <p>{reportMonth:MMMM yyyy}</p>
                </div>
                
                <div class='content'>
                    <p>Dear {userName},</p>
                    
                    <p>Thank you for your continued business with us. Here's your monthly transaction summary:</p>
                    
                    <div class='summary'>
                        <h3>Summary</h3>
                        <p><strong>Total Orders:</strong> {totalOrders}</p>
                        <p><strong>Total Amount:</strong> ${totalAmount:F2}</p>
                        <p><strong>Report Period:</strong> {reportMonth:MMMM yyyy}</p>
                    </div>
                    
                    <p>Please find your detailed transaction report attached as a PDF.</p>
                    
                    <p>If you have any questions about your transactions, please don't hesitate to contact our support team.</p>
                    
                    <p>Best regards,<br>E-Commerce Team</p>
                </div>
                
                <div class='footer'>
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </body>
            </html>";
    }
}

public record TransactionDto
{
    public string OrderNumber { get; init; } = string.Empty;
    public DateTime OrderDate { get; init; }
    public decimal TotalAmount { get; init; }
    public string Status { get; init; } = string.Empty;
    public IList<OrderItemDto> Items { get; init; } = new List<OrderItemDto>();
}

public record OrderItemDto
{
    public string ProductName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
    public decimal TotalPrice { get; init; }
}
