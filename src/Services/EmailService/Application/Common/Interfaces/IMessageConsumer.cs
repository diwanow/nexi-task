namespace EmailService.Application.Common.Interfaces;

public interface IMessageConsumer
{
    Task StartConsumingAsync(CancellationToken cancellationToken = default);
    Task StopConsumingAsync(CancellationToken cancellationToken = default);
}
