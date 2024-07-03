namespace Web.Api.Hubs;

public sealed record UserMessage(
    string Id, 
    string Sender, 
    string Content, 
    DateTime SentTimeUtc);
