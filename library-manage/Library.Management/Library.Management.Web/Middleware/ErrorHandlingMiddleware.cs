using Library.Management.BL.Entities.Response;
using Library.Management.BL.Enums;
using Library.Management.BL.Properties;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Library.Management.Web.Middleware
{
    /// <summary>
    /// Xử lý khi có exception xảy ra
    /// </summary>
    /// CreatedBy: VDDUNG (13/10/2020)
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        /// <summary>
        /// ErrorHandle
        /// </summary>
        /// <param name="next"></param>
        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }
        /// <summary>
        /// Invoke
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task Invoke(HttpContext context /* other dependencies */)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var code = HttpStatusCode.InternalServerError;
            var result = JsonConvert.SerializeObject(
                new ActionServiceResult
                {
                    Success = false,
                    Message = GlobalResource.Exception,
                    LibraryCode = LibraryCode.Exception,
                    Data = ex
                });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}
