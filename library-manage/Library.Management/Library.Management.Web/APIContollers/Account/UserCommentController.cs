using Library.Management.BL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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
