namespace Web.Api.Services;

public sealed class ChannelService : IChannelService
{
    public Task<bool> IsMemberAsync(
        string connectionId, 
        string channelId, 
        CancellationToken cancellationToken = default)
    {
        return Task.Run(() => true);
    }
}
