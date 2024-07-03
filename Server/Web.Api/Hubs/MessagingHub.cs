using Microsoft.AspNetCore.SignalR;

namespace Web.Api.Hubs;

public sealed class MessagingHub : Hub
{
    private static readonly List<UserMessage> MessageHistory = [];

    public async override Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("MessageHistory", MessageHistory);
    }

    public async Task PostMessage(string content)
    {
        string senderId = Context.ConnectionId;

        var message = new UserMessage(Guid.NewGuid().ToString(), senderId, content, DateTime.UtcNow);
        MessageHistory.Add(message);

        // Send only the required parameters
        await Clients.Others.SendAsync("ReceiveMessage", message.Id, senderId, content, message.SentTimeUtc);
        // Send the message to the caller as well (if desired)
        await Clients.Caller.SendAsync("ReceiveMessage", message.Id, senderId, content, message.SentTimeUtc);
    }

    public async Task RetrieveMessageHistory() =>
        await Clients.Caller.SendAsync("MessageHistory", MessageHistory);

    public async Task RemoveMessage(string messageId)
    {
        UserMessage? message = MessageHistory.FirstOrDefault(m => m.Id == messageId);
        if (message is not null)
        {
            MessageHistory.Remove(message);
            await Clients.All.SendAsync("MessageRemoved", messageId);
        }
    }
}
