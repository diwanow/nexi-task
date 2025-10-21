using EmailService.Application.Common.Interfaces;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace EmailService.Infrastructure.Services;

public class iTextPdfService : IPdfService
{
    public async Task<byte[]> GenerateTransactionReportAsync(string userId, IList<TransactionDto> transactions, CancellationToken cancellationToken = default)
    {
        using var memoryStream = new MemoryStream();
        
        // Create PDF document
        var document = new Document(PageSize.A4, 50, 50, 25, 25);
        var writer = PdfWriter.GetInstance(document, memoryStream);
        
        document.Open();

        // Add title
        var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.DARK_GRAY);
        var title = new Paragraph("Monthly Transaction Report", titleFont)
        {
            Alignment = Element.ALIGN_CENTER,
            SpacingAfter = 20
        };
        document.Add(title);

        // Add report date
        var dateFont = FontFactory.GetFont(FontFactory.HELVETICA, 12, BaseColor.GRAY);
        var reportDate = new Paragraph($"Report Generated: {DateTime.UtcNow:MMMM dd, yyyy}", dateFont)
        {
            Alignment = Element.ALIGN_CENTER,
            SpacingAfter = 30
        };
        document.Add(reportDate);

        // Add summary table
        var summaryTable = new PdfPTable(2)
        {
            WidthPercentage = 50,
            SpacingAfter = 20
        };
        summaryTable.SetWidths(new float[] { 1, 1 });

        var cellFont = FontFactory.GetFont(FontFactory.HELVETICA, 10);
        var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);

        // Summary data
        var totalOrders = transactions.Count;
        var totalAmount = transactions.Sum(t => t.TotalAmount);

        summaryTable.AddCell(new PdfPCell(new Phrase("Total Orders", headerFont)) { BackgroundColor = BaseColor.LIGHT_GRAY });
        summaryTable.AddCell(new PdfPCell(new Phrase(totalOrders.ToString(), cellFont)));
        summaryTable.AddCell(new PdfPCell(new Phrase("Total Amount", headerFont)) { BackgroundColor = BaseColor.LIGHT_GRAY });
        summaryTable.AddCell(new PdfPCell(new Phrase($"${totalAmount:F2}", cellFont)));

        document.Add(summaryTable);

        // Add transactions table
        if (transactions.Any())
        {
            var transactionsTable = new PdfPTable(5)
            {
                WidthPercentage = 100,
                SpacingBefore = 20
            };
            transactionsTable.SetWidths(new float[] { 2, 1, 1, 1, 1 });

            // Table headers
            var headerFont2 = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            var headerCell = new PdfPCell(new Phrase("Order Number", headerFont2)) { BackgroundColor = BaseColor.DARK_GRAY };
            transactionsTable.AddCell(headerCell);
            
            headerCell = new PdfPCell(new Phrase("Date", headerFont2)) { BackgroundColor = BaseColor.DARK_GRAY };
            transactionsTable.AddCell(headerCell);
            
            headerCell = new PdfPCell(new Phrase("Status", headerFont2)) { BackgroundColor = BaseColor.DARK_GRAY };
            transactionsTable.AddCell(headerCell);
            
            headerCell = new PdfPCell(new Phrase("Items", headerFont2)) { BackgroundColor = BaseColor.DARK_GRAY };
            transactionsTable.AddCell(headerCell);
            
            headerCell = new PdfPCell(new Phrase("Total", headerFont2)) { BackgroundColor = BaseColor.DARK_GRAY };
            transactionsTable.AddCell(headerCell);

            // Table data
            foreach (var transaction in transactions)
            {
                transactionsTable.AddCell(new PdfPCell(new Phrase(transaction.OrderNumber, cellFont)));
                transactionsTable.AddCell(new PdfPCell(new Phrase(transaction.OrderDate.ToString("MM/dd/yyyy"), cellFont)));
                transactionsTable.AddCell(new PdfPCell(new Phrase(transaction.Status, cellFont)));
                transactionsTable.AddCell(new PdfPCell(new Phrase(transaction.Items.Sum(i => i.Quantity).ToString(), cellFont)));
                transactionsTable.AddCell(new PdfPCell(new Phrase($"${transaction.TotalAmount:F2}", cellFont)));
            }

            document.Add(transactionsTable);
        }
        else
        {
            var noDataFont = FontFactory.GetFont(FontFactory.HELVETICA, 12, BaseColor.GRAY);
            var noDataParagraph = new Paragraph("No transactions found for this period.", noDataFont)
            {
                Alignment = Element.ALIGN_CENTER,
                SpacingBefore = 50
            };
            document.Add(noDataParagraph);
        }

        // Add footer
        var footerFont = FontFactory.GetFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);
        var footer = new Paragraph("This report was generated automatically by the E-Commerce System.", footerFont)
        {
            Alignment = Element.ALIGN_CENTER,
            SpacingBefore = 50
        };
        document.Add(footer);

        document.Close();

        return await Task.FromResult(memoryStream.ToArray());
    }
}
