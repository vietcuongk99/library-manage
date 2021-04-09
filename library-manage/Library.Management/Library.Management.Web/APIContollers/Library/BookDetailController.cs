using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Library.Management.Web
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookDetailController : BaseController<Book>
    {
        private new readonly IBaseBL<Book> _baseBL;
        private readonly IBookDetailBL _bookDetailBL;
        public BookDetailController(IBaseBL<Book> baseBL, IBookDetailBL bookDetailBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _bookDetailBL = bookDetailBL;
        }

        /// <summary>
        /// Lấy ra các thông tin dùng cho monitor
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        [HttpGet("GetMonitorActivation")]
        public async Task<ActionServiceResult> GetMonitorActivation()
        {
            var res = await _bookDetailBL.GetMonitorActivation();
            return res;
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        [HttpPost("InsertBookDetail")]
        public async Task<ActionServiceResult> InsertBookDetail(ParameterInsertBook param)
        {
            //Khai báo lại ID vì bên client không cần truyền lên ID, ID tự sinh
            param.BookImageUri = GlobalResource.DirectoryBookImageUri + param.BookId + ".jpg";
            param.BookDownloadUri = GlobalResource.DirectShowFolderBookInfo + param.BookId + ".pdf";
            var res = await _bookDetailBL.InsertBookDetail(param);
            return res;
        }

        /// <summary>
        /// Cập nhật 1 cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 19/03/2021
        [HttpPut("UpdateBookDetail")]
        public async Task<ActionServiceResult> UpdateBookDetail(ParameterUpdateBook param)
        {
            param.BookImageUri = GlobalResource.DirectoryBookImageUri + param.BookId + ".jpg";
            param.BookDownloadUri = GlobalResource.DirectShowFolderBookInfo + param.BookId + ".pdf";
            var res = await _bookDetailBL.UpdateBookDetail(param);
            return res;
        }

        /// <summary>
        /// Lấy ảnh đại diện sách từ đường dẫn
        /// </summary>
        /// <param name="bookID"></param>
        /// <param name="bookImageUri"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 22/03/2021
        [HttpGet("GetImageFromUrl")]
        public ActionServiceResult GetImageFromUrl(string bookID, string bookImageUri)
        {
            var res = new ActionServiceResult();
            var bookDetailUri = new BookImageUri();
            bookDetailUri.BookID = bookID;
            string imagePath;
            if (bookImageUri != null)
            {
                imagePath = Directory.GetCurrentDirectory() + bookImageUri;
            }
            else
            {
                imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryBookImageUri + GlobalResource.AvatarBookDefault;
            }
            // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
            if (System.IO.File.Exists(imagePath))
            {
                using (Image img = Image.FromFile(imagePath))
                {
                    if (img != null)
                    {
                        bookDetailUri.BookDetailImageUri = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                    }
                }
            }
            res.Data = bookDetailUri;
            return res;
        }

        /// <summary>
        /// Lưu ảnh đại diện sách 
        /// </summary>
        /// <param name="bookImageUri"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 22/03/2021
        [HttpPost("SaveImageToUrl")]
        public async Task<ActionServiceResult> SaveImageToUrl(BookImageUri bookImageUri)
        {
            var res = new ActionServiceResult();
            //For demo purpose I only use jpg file and save file name by userId
            if (!string.IsNullOrEmpty(bookImageUri.BookDetailImageUri))
            {
                using (Image image = _baseBL.Base64ToImage(bookImageUri.BookDetailImageUri))
                {
                    string bookDetailImageUri = GlobalResource.DirectoryBookImageUri + bookImageUri.BookID + ".jpg";
                    string strFileName = Directory.GetCurrentDirectory() + bookDetailImageUri;
                    image.Save(strFileName, ImageFormat.Jpeg);
                    if (System.IO.File.Exists(strFileName))
                    {
                        var param = new { BookID = bookImageUri.BookID, BookImageUri = bookDetailImageUri };
                        await _bookDetailBL.SaveBookImageToUri(param);
                        res.Data = bookDetailImageUri;
                    }
                    else
                    {
                        res.Success = false;
                        res.Message = GlobalResource.Failed;
                        res.LibraryCode = LibraryCode.Failed;
                    }
                }
            }
            else
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }

        /// <summary>
        /// Lọc dữ liệu phân trang danh sách sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 26/03/2021
        [HttpGet("GetPagingData")]
        public async Task<ActionServiceResult> GetPagingData([FromQuery] ParamFilterBookDetail param)
        {
            var res = await _bookDetailBL.GetPagingData(param);
            if (res.Data != null)
            {
                // Lọc dữ liệu phân trang
                var offset = (param.pageNumber - 1) * param.pageSize;
                var dataLimit = (res.Data as List<ResponseProcedureBookDetail>).Skip(offset).Take(param.pageSize);
                if (dataLimit.Count() > 0)
                {
                    var data = ShowListBookImageConvertBase64String(dataLimit.ToList());
                    res.Data = new
                    {
                        TotalRecord = (res.Data as List<ResponseProcedureBookDetail>).Count,
                        DataItems = data
                    };
                }
                else
                {
                    res.Data = null;
                }
            };
            return res;
        }

        /// <summary>
        /// Convert list ảnh sách về dạng base64 để hiển thị lên giao diện
        /// </summary>
        /// <param name="lstBookImageUri"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        private List<ResponseBookDetailDownloadInfo> ShowListBookImageConvertBase64String(List<ResponseProcedureBookDetail> lstBookImageUri)
        {
            var res = new ActionServiceResult();
            var lstBookUriConvertBase64 = new List<ResponseBookDetailDownloadInfo>();
            string imagePath;
            // Vòng for trả về list Book chứa các đường dẫn Base64 được convert từ link ảnh
            foreach (ResponseProcedureBookDetail bookImageUri in lstBookImageUri)
            {
                var bookUriConvertBase64 = new ResponseBookDetailDownloadInfo();
                bookUriConvertBase64.BookID = bookImageUri.BookID;
                bookUriConvertBase64.BookName = bookImageUri.BookName;
                bookUriConvertBase64.BookAuthor = bookImageUri.BookAuthor;
                if (bookImageUri.BookImageUri != null)
                {
                    imagePath = Directory.GetCurrentDirectory() + bookImageUri.BookImageUri;
                }
                else
                {
                    imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryBookImageUri + GlobalResource.AvatarBookDefault;
                }
                // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
                if (System.IO.File.Exists(imagePath))
                {
                    using (Image img = Image.FromFile(imagePath))
                    {
                        if (img != null)
                        {
                            bookUriConvertBase64.BookImageUriBase64String = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstBookUriConvertBase64.Add(bookUriConvertBase64);
                        }
                    }
                }
                else
                {
                    // Nếu link ảnh có nhưng không chính xác thì bắn về ảnh mặc định
                    imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryBookImageUri + GlobalResource.AvatarBookDefault;
                    using (Image img = Image.FromFile(imagePath))
                    {
                        if (img != null)
                        {
                            bookUriConvertBase64.BookImageUriBase64String = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstBookUriConvertBase64.Add(bookUriConvertBase64);
                        }
                    }
                }
            }
            return lstBookUriConvertBase64;
        }

        /// <summary>
        /// Lưu file mượn sách của thư viện
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 23/03/2021
        [HttpPost("SaveFileBookInfo")]
        public async Task<ActionServiceResult> SaveFileBookInfo(BookDetailDownloadInfo param)
        {
            var res = new ActionServiceResult();
            string bookDetailDownloadInfo = GlobalResource.DirectoryBookInfo + param.BookID + ".pdf";
            string strFileName = Directory.GetCurrentDirectory() + bookDetailDownloadInfo;
            byte[] bytes = Convert.FromBase64String(param.BookDetailBase64String);
            System.IO.File.WriteAllBytes(strFileName, bytes);
            //Config lại đường dẫn vì đặt trong wwwroot khi get ra không cần thêm wwwroot vào url
            string bookGetUrl = GlobalResource.DirectShowFolderBookInfo + param.BookID + ".pdf";
            if (System.IO.File.Exists(strFileName))
            {
                var parameter = new { BookID = param.BookID, BookDownloadUri = bookGetUrl };
                await _bookDetailBL.SaveFileBookInfo(parameter);
                res.Data = bookGetUrl;
            }
            else
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }

        /// <summary>
        /// Mở tài liệu 1 cuốn sách
        /// </summary>
        /// <param name="BookID"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        [HttpPost("OpenFileBookInfo")]
        public async Task<IActionResult> OpenFileBookInfo(string BookID)
        {
            var bookInfo = await _baseBL.GetEntityById(BookID);
                string FilePath = Directory.GetCurrentDirectory() + bookInfo.BookDownloadUri;
            // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
            var stream = new FileStream(FilePath, FileMode.Open);
            return File(stream, "application/pdf", "FileDownloadName.pdf");
                    //WebClient User = new WebClient();
                    //Byte[] FileBuffer = User.DownloadData(FilePath);
                    //if (FileBuffer != null)
                    //{

                    //    Response.ContentType = "application/pdf";
                    //    Response.Headers.Add("content-length", FileBuffer.Length.ToString());
                    //    using (Stream writer = System.IO.File.Create("C:/Users/Dell.DESKTOP-722I0QM/Downloads/File_PDF/MyPDF.pdf"))
                    //    {
                    //        writer.Write(FileBuffer, 0, FileBuffer.Length);
                    //        writer.Flush();
                    //    }
                    //}
        }

        /// <summary>
        /// API lọc phân trang sách V2
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 07/04/2021
        [HttpGet("GetPagingDataV2")]
        public async Task<ActionServiceResult> GetPagingDataV2([FromQuery]ParamFilterBookDetailV2 param)
        {
            var res = await _bookDetailBL.GetPagingDataV2(param);
            if (res.Data != null)
            {
                // Lọc dữ liệu phân trang
                var offset = (param.pageNumber - 1) * param.pageSize;
                var dataLimit = (res.Data as List<ResponseProcedureBookDetail>).Skip(offset).Take(param.pageSize);
                if (dataLimit.Count() > 0)
                {
                    var data = ShowListBookImageConvertBase64String(dataLimit.ToList());
                    res.Data = new
                    {
                        TotalRecord = (res.Data as List<ResponseProcedureBookDetail>).Count,
                        DataItems = data
                    };
                }
                else
                {
                    res.Data = null;
                }
            };
            return res;
        }
    }
}
