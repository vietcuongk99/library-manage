using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Library.Management.BL.Interfaces
{
    public interface IUploadBL
    {
        public bool ImportBookData(IFormFile fileImport);
    }
}
