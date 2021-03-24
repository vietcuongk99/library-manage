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
        /// Convert list ảnh sách về dạng base64 để hiển thị lên giao diện
        /// </summary>
        /// <param name="lstBookImageUri"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPost("ShowListBookImageConvertBase64String")]
        public ActionServiceResult ShowListBookImageConvertBase64String(List<BookImageUri> lstBookImageUri)
        {
            var res = new ActionServiceResult();
            var lstBookUriConvertBase64 = new List<BookDetailDownloadInfo>();
            var bookUriConvertBase64 = new BookDetailDownloadInfo();
            string imagePath;
            // Vòng for trả về list Book chứa các đường dẫn Base64 được convert từ link ảnh
            foreach (BookImageUri bookImageUri in lstBookImageUri)
            {
                bookUriConvertBase64.BookID = bookImageUri.BookID;
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
                            bookUriConvertBase64.BookDetailBase64String = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstBookUriConvertBase64.Add(bookUriConvertBase64);
                        }
                    }
                }
            }
            
            res.Data = lstBookUriConvertBase64;
            return res;
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
            if (System.IO.File.Exists(strFileName))
            {
                var parameter = new { BookID = param.BookID, BookDownloadUri = bookDetailDownloadInfo };
                await _bookDetailBL.SaveFileBookInfo(parameter);
                res.Data = bookDetailDownloadInfo;
            }
            else
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
                res.LibraryCode = LibraryCode.Failed;
            }
            return res;
        }
    }
}
