namespace Web.Api.Hubs;

public sealed record UserMessage(string Sender, string Content, DateTime SentTimeUtc);
