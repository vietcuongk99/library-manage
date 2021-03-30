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
    public class BookBorrowController : BaseController<BookBorrow>
    {
        private new readonly IBaseBL<BookBorrow> _baseBL;
        private readonly IBookBorrowBL _bookBorrowBL;
        public BookBorrowController(IBaseBL<BookBorrow> baseBL, IBookBorrowBL bookBorrowBL) : base(baseBL)
        {
            _baseBL = baseBL;
            _bookBorrowBL = bookBorrowBL;
        }

        /// <summary>
        /// Lấy danh sách sách đang mượn của người dùng
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpGet("GetPagingData")]
        public async Task<ActionServiceResult> GetPagingData(ParamFilterBookBorrow param)
        {
            var res = await _bookBorrowBL.GetPagingData(param);
            if (res.Data != null)
            {
                res.Data = ShowListBookImageConvertBase64String((List<ResponseProcedureBookBorrow>)res.Data);
            };
            return res;
        }

        /// <summary>
        /// Convert list ảnh sách về dạng base64 để hiển thị lên giao diện
        /// </summary>
        /// <param name="lstBookImageUri"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        private List<ResponseBookBorrowDownloadInfo> ShowListBookImageConvertBase64String(List<ResponseProcedureBookBorrow> lstBookImageUri)
        {
            var res = new ActionServiceResult();
            var lstBookUriConvertBase64 = new List<ResponseBookBorrowDownloadInfo>();
            string imagePath;
            // Vòng for trả về list Book chứa các đường dẫn Base64 được convert từ link ảnh
            foreach (ResponseProcedureBookBorrow bookImageUri in lstBookImageUri)
            {
                var bookUriConvertBase64 = new ResponseBookBorrowDownloadInfo();
                bookUriConvertBase64.BookBorrowID = bookImageUri.BookBorrowID;
                bookUriConvertBase64.BookID = bookImageUri.BookID;
                bookUriConvertBase64.BookName = bookImageUri.BookName;
                bookUriConvertBase64.BookAuthor = bookImageUri.BookAuthor;
                bookUriConvertBase64.BorrowDate = bookImageUri.BorrowDate;
                bookUriConvertBase64.BorrowStatus = bookImageUri.BorrowStatus;
                bookUriConvertBase64.ReturnDate = bookImageUri.ReturnDate;
                if (bookImageUri != null)
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
        /// Tạo mới giao dịch mượn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPost("BorrowActivation")]
        public async Task<ActionServiceResult> BorrowActivation(ParameterInsertBookBorrow param)
        {
            var res = await _bookBorrowBL.BorrowActivation(param);
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin trả sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPut("RestoreActivation")]
        public async Task<ActionServiceResult> RestoreActivation(ParameterUpdateBookBorrow param)
        {
            var res = await _bookBorrowBL.RestoreActivation(param);
            return res;
        }

        /// <summary>
        /// Cập nhật thông tin gia hạn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 24/03/2021
        [HttpPut("ExtendActivation")]
        public async Task<ActionServiceResult> ExtendActivation(ParameterExtendBookBorrow param)
        {
            var res = await _bookBorrowBL.ExtendActivation(param);
            return res;
        }
    }
}
