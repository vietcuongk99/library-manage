using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL.Interfaces
{
    public interface IUploadBL
    {
        public Task<Dictionary<string, int>> ImportBookDataAsync(IFormFile fileImport);
    }
}
