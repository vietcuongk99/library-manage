using BitMiracle.Docotic.Pdf;
using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
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
                bookUriConvertBase64.Description = bookImageUri.Description;
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
        public ActionServiceResult OpenFileBookInfo([FromQuery] string BookID)
        {
            var res = new ActionServiceResult();
            string FilePath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryBookInfo + BookID + ".pdf";
            // Nếu tồn tại đường dẫn chứa ảnh thì gọi đến, không thì gọi về ảnh mặc định
            if (!System.IO.File.Exists(FilePath))
            {
                res.Success = false;
                res.Message = GlobalResource.Failed;
            }
            return res;
        }

        /// <summary>
        /// API lọc phân trang sách V2
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 07/04/2021
        [HttpGet("GetPagingDataV2")]
        public async Task<ActionServiceResult> GetPagingDataV2([FromQuery] ParamFilterBookDetailV2 param)
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

        /// <summary>
        /// API Zalo đọc text
        /// </summary>
        /// <param name="input">text truyền vào</param>
        /// <param name="speak_id">option 1 2 3 4 tương ứng các giọng đọc khác nhau</param>
        /// <param name="speed"> mặc định truyền 1</param>
        /// <returns></returns>
        [HttpPost("GetAPIZaloAI")]
        public ActionResult GetAPIZaloAI([FromQuery] string input, int speak_id, int speed)
        {

            IRestResponse response;
            var client = new RestClient("https://api.zalo.ai/v1/tts/synthesize?apikey=9YX4lUKZXTV3a9EJ0suhFDzVNaaN6ODq");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("input", input);
            request.AddParameter("speaker_id", speak_id.ToString());
            request.AddParameter("speed", speed);
            response = client.Execute(request);
            var file = base.File(response.RawBytes, "audio/wav");
            return file;
        }

        /// <summary>
        /// API viettel đọc text
        /// </summary>
        /// <param name="text">đoạn text truyền vào để đọc</param>
        /// <param name="voice">giọng đọc 1- nam 2 - nữ</param>
        /// <param name="speed">speed kéo dài từ 0.7 đến 1.3</param>
        /// <returns></returns>
        [HttpPost("GetAPIViettelAI")]
        public ActionResult GetAPIViettelAI([FromQuery] string text, int voice, int speed)
        {
            var client = new RestClient("https://viettelgroup.ai/voice/api/tts/v1/rest/syn");
            client.Timeout = -1;
            string voiceConfig = string.Empty;

            text = text.Replace("\n", " ");
            text = text.Replace("\r", " ");
            if (text.Length > 5000)
            {
                text = text.Substring(0, 5000);
            }
            switch (voice)
            {
                case 1:
                    voiceConfig = "hn-thanhtung";
                    break;
                case 2:
                    voiceConfig = "hn-phuongtrang";
                    break;
            }
            var jsonObject = new
            {
                id = 3,
                speed = speed,
                text = text,
                timeout = 60000,
                tts_return_option = 2,
                voice = voiceConfig,
                without_filter = false
            };

            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddJsonBody(jsonObject);
            IRestResponse response = client.Execute(request);
            var file = base.File(response.RawBytes, "audio/wav");
            return file;
        }

        /// <summary>
        /// API viettel đọc text file pdf
        /// </summary>
        /// <param name="text">đoạn text truyền vào để đọc</param>
        /// <param name="voice">giọng đọc 1- nam 2 - nữ</param>
        /// <param name="speed">speed kéo dài từ 0.7 đến 1.3</param>
        /// <returns></returns>
        [HttpPost("GetAPIViettelAIV2")]
        public ActionResult GetAPIViettelAIV2([FromQuery] int voice, int speed, Guid BookID)
        {
            var filepath = Directory.GetCurrentDirectory() + GlobalResource.DirectoryBookInfo + BookID.ToString() + ".pdf";
            if (!System.IO.File.Exists(filepath))
            {
                return null;
            }
            else
            {
                byte[] bytes = System.IO.File.ReadAllBytes(filepath);
                using (PdfDocument doc = new PdfDocument(filepath))
                {
                    string text = doc.GetTextWithFormatting();
                    text = text.Replace("\n", " ");
                    text = text.Replace("\r", " ");
                    if (text.Length > 5000)
                    {
                        text = text.Substring(0, 5000);
                    }
                    var client = new RestClient("https://viettelgroup.ai/voice/api/tts/v1/rest/syn");
                    client.Timeout = -1;
                    string voiceConfig = string.Empty;
                    switch (voice)
                    {
                        case 1:
                            voiceConfig = "hn-thanhtung";
                            break;
                        case 2:
                            voiceConfig = "hn-phuongtrang";
                            break;
                        case 3:
                            voiceConfig = "hcm-diemmy";
                            break;
                        case 4:
                            voiceConfig = "hcm-minhquan";
                            break;
                        case 5:
                            voiceConfig = "hue-baoquoc";
                            break;
                        case 6:
                            voiceConfig = "lethiyen";
                            break;
                    }

                    var jsonObject = new
                    {
                        id = 3,
                        speed = speed,
                        text = text,
                        timeout = 60000,
                        tts_return_option = 2,
                        voice = voiceConfig,
                        without_filter = false
                    };

                    var request = new RestRequest(Method.POST);
                    request.AddHeader("Content-Type", "application/json");
                    request.AddJsonBody(jsonObject);
                    IRestResponse response = client.Execute(request);
                    var file = base.File(response.RawBytes, "audio/wav");
                    return file;
                }
            }
        }
    }
}
