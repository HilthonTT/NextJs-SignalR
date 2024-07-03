using Web.Api.Hubs;
using Web.Api.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR();

builder.Services.AddScoped<IChannelService, ChannelService>();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseDefaultFiles();

// Use CORS with the specified policy
app.UseCors("CorsPolicy");
// Use default files and static files
app.UseDefaultFiles();
app.UseStaticFiles();
// Map the MessagingHub to the "/hub" endpoint
app.MapHub<MessagingHub>("/hub");
app.MapHub<ChannelHub>("/channelHub");

app.Run();
