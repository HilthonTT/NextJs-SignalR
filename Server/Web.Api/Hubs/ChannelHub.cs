using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using Web.Api.Services;

namespace Web.Api.Hubs;

public sealed class ChannelHub(IChannelService channelService) : Hub
{
    private static readonly ConcurrentDictionary<string, List<UserMessage>> ChannelMessages = new();

    public async Task JoinChannel(string channelId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId);

        if (ChannelMessages.TryGetValue(channelId, out var messages))
        {
            await Clients.Caller.SendAsync("ChannelMessageHistory", messages);
        }
    }

    public async Task LeaveChannel(string channelId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId);
    }

    public async Task SendMessageToChannel(string channelId, string content)
    {
        bool isMember = await channelService.IsMemberAsync(Context.ConnectionId, channelId);
        if (!isMember)
        {
            await Clients.Caller.SendAsync("ErrorMessage", "You are not a member of this channel.");
            return;
        }

        string senderId = Context.ConnectionId;
        var message = new UserMessage(senderId, content, DateTime.UtcNow);

        ChannelMessages.AddOrUpdate(channelId, [message], (key, existingMessages) =>
        {
            existingMessages.Add(message);
            return existingMessages;
        });

        await Clients.Group(channelId).SendAsync("ReceiveChannelMessage", senderId, content, message.SentTimeUtc);
    }
}
