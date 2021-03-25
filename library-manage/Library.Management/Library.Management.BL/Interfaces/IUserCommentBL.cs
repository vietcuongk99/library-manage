using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IUserCommentBL
    {
        /// <summary>
        /// Thêm mới bình luận
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> CommentBookDetailActivation(ParameterCommentBookDetail param);
        /// <summary>
        /// Chỉnh sửa bình luận
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> ModifyCommentBookDetail(ParameterModifyComment param);
        
    }
}
