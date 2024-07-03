namespace Web.Api.Services;

public interface IChannelService
{
    Task<bool> IsMemberAsync(string connectionId, string channelId, CancellationToken cancellationToken = default);
}
