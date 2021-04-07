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
        /// Lấy danh sách sách đang mượn và yêu cầu mượn của người dùng
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// ModifiedBy: Cuong 06/04/2021
        [HttpGet("GetPagingData")]
        public async Task<ActionServiceResult> GetPagingData([FromQuery] ParamFilterBookBorrow param)
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
        /// ModifiedBy: CUONG 06/04/2021
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
                //status của bảng BookBorrow
                bookUriConvertBase64.BookBorrowStatus = bookImageUri.BookBorrowStatus;
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
        /// Lấy ra danh sách yêu cầu mượn sách gửi lên
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 04/04/2021
        [HttpGet("GetListRequestActivation")]
        public async Task<ActionServiceResult> GetListRequestActivation()
        {
            var res = await _bookBorrowBL.GetListRequestActivation();
            if (res.Data != null)
            {
                res.Data = ConvertAvtImage((List<ReponseProcedureListRequestBorrowActivation>)res.Data);
            };
            return res;
        }

        /// <summary>
        /// Convert link ảnh người dùng sang base64
        /// </summary>
        /// <param name="lst"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        private List<ReponseProcedureListRequestBorrowActivation> ConvertAvtImage(List<ReponseProcedureListRequestBorrowActivation> lst)
        {
            var res = new ActionServiceResult();
            var lstAvtUriConvertBase64 = new List<ReponseProcedureListRequestBorrowActivation>();
            string imagePath;
            // Vòng for trả về list Book chứa các đường dẫn Base64 được convert từ link ảnh
            foreach (ReponseProcedureListRequestBorrowActivation avtImageUri in lst)
            {
                var avtUriConvertBase64 = new ReponseProcedureListRequestBorrowActivation();
                avtUriConvertBase64.BookBorrowID = avtImageUri.BookBorrowID;
                avtUriConvertBase64.BookID = avtImageUri.BookID;
                avtUriConvertBase64.UserID = avtImageUri.UserID;
                avtUriConvertBase64.CreatedDate = avtImageUri.CreatedDate;
                avtUriConvertBase64.CreatedBy = avtImageUri.CreatedBy;
                avtUriConvertBase64.BookName = avtImageUri.BookName;
                avtUriConvertBase64.UserName = avtImageUri.UserName;
                avtUriConvertBase64.Email = avtImageUri.Email;
                avtUriConvertBase64.Age = avtImageUri.Age;
                avtUriConvertBase64.FirstName = avtImageUri.FirstName;
                avtUriConvertBase64.LastName = avtImageUri.LastName;
                if (avtImageUri.AvatarUrl != null)
                {
                    imagePath = Directory.GetCurrentDirectory() + avtImageUri.AvatarUrl;
                }
                else
                {
                    imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryImage + GlobalResource.AvatarUserDefault;
                }
                // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
                if (System.IO.File.Exists(imagePath))
                {
                    using (Image img = Image.FromFile(imagePath))
                    {
                        if (img != null)
                        {
                            avtUriConvertBase64.AvatarUrl = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstAvtUriConvertBase64.Add(avtUriConvertBase64);
                        }
                    }
                }
                else
                {
                    // Nếu link ảnh có nhưng không chính xác thì bắn về ảnh mặc định
                    imagePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryImage + GlobalResource.AvatarUserDefault;
                    using (Image img = Image.FromFile(imagePath))
                    {
                        if (img != null)
                        {
                            avtUriConvertBase64.AvatarUrl = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstAvtUriConvertBase64.Add(avtUriConvertBase64);
                        }
                    }
                }
            }
            return lstAvtUriConvertBase64;
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
        /// Xác nhận yêu cầu mượn sách từ phía Admin
        /// </summary>
        /// <param name="listBorrowID"></param>
        /// <param name="statusActivate"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 04/04/2021
        [HttpPost("ConfirmBorrowActivation")]
        public async Task<ActionServiceResult> ConfirmBorrowActivation([FromBody] List<string> listBorrowID, int statusActivate)
        {
            var response = new ActionServiceResult();
            int totalRecordConfirm = 0, totalFail = 0;

            if (listBorrowID.Count == 0 || listBorrowID == null)
            {
                response.Success = false;
                response.LibraryCode = LibraryCode.ValidateEntity;
                response.Message = GlobalResource.ValidateEntity;
            }
            else
            {
                // Đặt vòng lặp chạy từng bản ghi một
                foreach (var id in listBorrowID)
                {
                    response = await _bookBorrowBL.ConfirmBorrowActivation(id, statusActivate);
                    if (response.Success == true)
                    {
                        totalRecordConfirm += 1;
                    }
                    else
                    {
                        totalFail += 1;
                    }
                }
                if (totalRecordConfirm > 0)
                {
                    if (statusActivate == (int)StatusActivate.Remove)
                    {
                        response.Message = string.Format(GlobalResource.ConfirmMessageBorrowBookDetail, EnumResource.StatusActivateRemove, totalRecordConfirm);
                    }
                    else
                    {
                        response.Message = string.Format(GlobalResource.ConfirmMessageBorrowBookDetail, EnumResource.StatusActivateConfirm, totalRecordConfirm);
                    }
                }
            }
            return response;
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
