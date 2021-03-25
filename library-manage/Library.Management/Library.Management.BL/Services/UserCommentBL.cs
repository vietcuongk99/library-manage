using Library.Management.DL;
using Library.Management.Entity;
using Library.Management.Entity.Models;
using Library.Management.Entity.Properties;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public class UserCommentBL : IUserCommentBL
    {
        private readonly IBaseDL<UserComment> _baseDL;

        public UserCommentBL(IBaseDL<UserComment> baseDL)
        {
            _baseDL = baseDL;
        }

        /// <summary>
        /// Thêm 1 bình luận mới
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        public async Task<ActionServiceResult> CommentBookDetailActivation(ParameterCommentBookDetail param)
        {
            var res = new ActionServiceResult();
            var userComment = new UserComment();
            userComment.CommentId = Guid.NewGuid();
            userComment.BookId = param.BookId;
            userComment.UserId = param.UserId;
            userComment.Comment = param.Comment;
            userComment.Status = (int)Status.Active;
            userComment.CreatedDate = DateTime.Now;
            userComment.CreatedBy = GlobalResource.CreatedBy;
            res.Data = await _baseDL.AddAsync(userComment, ProcdureTypeName.Insert);
            return res;
        }

        /// <summary>
        /// Sửa bình luận
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 25/03/2021
        public async Task<ActionServiceResult> ModifyCommentBookDetail(ParameterModifyComment param)
        {
            var res = new ActionServiceResult();
            if (param.CommentId != null)
            {
                var userComment = await _baseDL.GetEntityById(param.CommentId.ToString());
                if(userComment == null)
                {
                    res.Success = false;
                    res.Message = GlobalResource.ErrorCommentUser;
                    res.LibraryCode = LibraryCode.ErrorCommentUser;
                }
                else
                {
                    res.Data = _baseDL.UpdateAsync(param, ProcdureTypeName.Update);
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
    }
}
