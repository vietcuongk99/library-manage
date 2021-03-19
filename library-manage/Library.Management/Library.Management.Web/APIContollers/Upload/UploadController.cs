using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Library.Management.BL.Interfaces;
using Library.Management.BL.Services;
using Library.Management.Entity;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library.Management.Web.APIContollers.Upload
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IUploadBL _uploadBL;

        public UploadController(IUploadBL uploadBL)
        {
            _uploadBL = uploadBL;
        }

        [HttpGet]
        [Route("downloadTemplateFile")]
        public ActionResult DownloadTemplateFile()
        {
            string Files = "~Temp/UploadExcel/File mau nhap khau sach.xlsx";
            byte[] fileBytes = System.IO.File.ReadAllBytes(Files);
            System.IO.File.WriteAllBytes(Files, fileBytes);
            MemoryStream ms = new MemoryStream(fileBytes);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, "File mau nhap khau sach.xlsx");
        }

        [HttpPost]
        [Route("uploadFileImport")]
        public ActionServiceResult UploadFileImportBook()
        {
            IFormFile fileExcel = Request.Form.Files[0];

            return new ActionServiceResult
            {
                Success = true,
                LibraryCode = LibraryCode.Success,
                Message = GlobalResource.Success,
                Data = _uploadBL.ImportBookData(fileExcel)
            };
        }
    }
}
