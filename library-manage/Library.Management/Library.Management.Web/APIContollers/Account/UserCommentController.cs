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
    public class UserCommentController : BaseController<UserComment>
    {
        private new readonly IBaseBL<UserComment> _baseBL;
        private readonly IUserCommentBL _userComment;
        public UserCommentController(IBaseBL<UserComment> baseBL, IUserCommentBL userComment) : base(baseBL)
        {
            _baseBL = baseBL;
            _userComment = userComment;
        }

        /// <summary>
        /// Lấy ra các bình luận của 1 người dùng trên 1 cuốn sách
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="bookId"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        [HttpGet("GetCommentByUserAndBookDetail")]
        public async Task<ActionServiceResult> GetCommentByUserAndBookDetail(string userId, string bookId)
        {
            var param = new
            {
                UserId = userId,
                bookId = bookId
            };
            var res = await _userComment.GetCommentByUserAndBookDetail(param);
            return res;
        }

        /// <summary>
        /// Lấy ra các bình luận của 1 người dùng
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        [HttpGet("GetCommentByUser")]
        public async Task<ActionServiceResult> GetCommentByUser(string UserId)
        {
            var res = await _userComment.GetCommentByUser(UserId);
            return res;
        }

        /// <summary>
        /// Lấy ra các bình luận trên 1 cuốn sách
        /// </summary>
        /// <param name="BookId"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        [HttpGet("GetCommentByBookDetail")]
        public async Task<ActionServiceResult> GetCommentByBookDetail([FromQuery]ParameterShowCommentInBookDetail param)
        {
            var res = await _userComment.GetCommentByBookDetail(param);
            if (res.Data != null)
            {
                // Lọc dữ liệu phân trang
                if (param.pageNumber == 0) param.pageNumber = 1;
                if (param.pageSize == 0) param.pageSize = int.Parse(GlobalResource.PageSize);
                var offset = (param.pageNumber - 1) * param.pageSize;
                var dataLimit = (res.Data as List<ResponseProcedureUserComment>).Skip(offset).Take(param.pageSize);
                if (dataLimit.Count() > 0)
                {
                    var data = ShowListUserAvatarImageConvert(dataLimit.ToList());
                    res.Data = new
                    {
                        TotalRecord = (res.Data as List<ResponseProcedureUserComment>).Count,
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
        /// Convert ảnh từ đường dẫn về link base64
        /// </summary>
        /// <param name="lstUserComment"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 07/04/2021
        private List<ResponseProcedureUserComment> ShowListUserAvatarImageConvert(List<ResponseProcedureUserComment> lstUserComment)
        {
            var res = new ActionServiceResult();
            var lstUserCommentConvertBase64 = new List<ResponseProcedureUserComment>();
            string imagePath;
            // Vòng for trả về list comment chứa các đường dẫn Base64 được convert từ link ảnh
            foreach (ResponseProcedureUserComment userComment in lstUserComment)
            {
                var userCommentConvertBase64 = new ResponseProcedureUserComment();
                userCommentConvertBase64.CommentId = userComment.CommentId;
                userCommentConvertBase64.UserId = userComment.UserId;
                userCommentConvertBase64.UserName = userComment.UserName;
                userCommentConvertBase64.BookId = userComment.BookId;
                userCommentConvertBase64.Comment = userComment.Comment;
                userCommentConvertBase64.CreatedDate = userComment.CreatedDate;
                userCommentConvertBase64.CreatedBy = userComment.CreatedBy;
                userCommentConvertBase64.ModifiedDate = userComment.ModifiedDate;
                userCommentConvertBase64.ModifiedBy = userComment.ModifiedBy;

                if (userComment.AvatarUrl != null)
                {
                    imagePath = Directory.GetCurrentDirectory() + userComment.AvatarUrl;
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
                            userCommentConvertBase64.AvatarUrl = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstUserCommentConvertBase64.Add(userCommentConvertBase64);
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
                            userCommentConvertBase64.AvatarUrl = _baseBL.ImageToBase64(img, ImageFormat.Jpeg);
                            lstUserCommentConvertBase64.Add(userCommentConvertBase64);
                        }
                    }
                }
            }
            return lstUserCommentConvertBase64;
        }


        /// <summary>
        /// Thêm mới bình luận
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        [HttpPost("CommentBookDetailActivation")]
        public async Task<ActionServiceResult> CommentBookDetailActivation(ParameterCommentBookDetail param)
        {
            var res = await _userComment.CommentBookDetailActivation(param);
            return res;
        }

        /// <summary>
        /// Sửa đổi bình luận
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        [HttpPut("ModifyCommentBookDetail")]
        public async Task<ActionServiceResult> ModifyCommentBookDetail(ParameterModifyComment param)
        {
            var res = await _userComment.ModifyCommentBookDetail(param);
            return res;
        }
    }
}
