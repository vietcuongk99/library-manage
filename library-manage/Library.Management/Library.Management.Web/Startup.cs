using Library.Management.BL;
using Library.Management.BL.Interfaces;
using Library.Management.BL.Services;
using Library.Management.DL;
using Library.Management.Entity.Models;
using Library.Management.Web.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Pomelo.EntityFrameworkCore.MySql.Storage;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Library.Management.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            string connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddControllers();
            services.AddMvc();
            services.AddMemoryCache();

            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromSeconds(10);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Library Management Service", Version = "v1" });
                var xmlFile = Path.ChangeExtension(typeof(Startup).Assembly.Location, ".xml");
            });

            services.AddScoped(typeof(IBaseBL<>), typeof(BaseBL<>));
            services.AddScoped(typeof(IBaseDL<>), typeof(BaseDL<>));

            services.AddScoped<IBookDetailBL, BookDetailBL>();
            services.AddScoped<IBookDetailDL, BookDetailDL>();

            services.AddScoped<IBookCategoryBL, BookCategoryBL>();
            services.AddScoped<IBookCategoryDL, BookCategoryDL>();

            services.AddScoped<IBookBorrowBL, BookBorrowBL>();
            services.AddScoped<IBookBorrowDL, BookBorrowDL>();

            services.AddScoped<IUploadBL, UploadBL>();

            services.AddScoped<IUserCommentBL, UserCommentBL>();

            services.AddScoped<IUserAccountBL, UserAccountBL>();
            services.AddScoped<IUserAccountDL, UserAccountDL>();

            services.AddScoped<IBaseMemoryCache, BaseMemoryCache>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UsePathBase("/admin");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Library Management Version 1");
                c.RoutePrefix = "swagger";
            });

            app.UseHttpsRedirection();
            app.UseMiddleware(typeof(ErrorHandlingMiddleware));
            app.UseRouting();
            app.UseSession();

            app.UseAuthorization();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
