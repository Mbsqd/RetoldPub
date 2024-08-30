using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using retold_server.application.Interfaces.Auth;
using retold_server.application.Services;
using retold_server.data_access;
using retold_server.data_access.Repositories;
using retold_server.domain.Abstractions;
using retold_server.infrastructure;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Connection to database
builder.Services.AddDbContext<RetoldDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(RetoldDbContext)));
});

// Configure jwt authentication
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Authentication:JwtOptions"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtOptions = builder.Configuration.GetSection("Authentication:JwtOptions").Get<JwtOptions>();
        if (jwtOptions == null) { throw new ArgumentNullException("Invalid JwtOptions"); }

        var JwtSecretKey = Encoding.UTF8.GetBytes(jwtOptions.SecretKey);
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(JwtSecretKey),
            ValidAudience = jwtOptions.Audience,
            ValidIssuer = jwtOptions.Issuer
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["app-cookie"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Configure scoped
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();

builder.Services.AddScoped<IBlocksService, BlocksService>();
builder.Services.AddScoped<IBlocksRepository, BlocksRepository>();
builder.Services.AddScoped<ISchedulesRepository, SchedulesRepository>();
builder.Services.AddScoped<IConsultationsRepository, ConsultationsRepository>();

builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

// Configure cors
string AllowSpecificOrigins = "_AllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

var app = builder.Build();

// app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always

});

app.UseCors(AllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
