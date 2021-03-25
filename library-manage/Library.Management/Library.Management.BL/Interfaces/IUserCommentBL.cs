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
        /// Lấy ra các bình luận của 1 người dùng trên 1 cuốn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> GetCommentByUserAndBookDetail(object param);

        /// <summary>
        /// Lấy ra các bình luận của 1 người dùng
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        Task<ActionServiceResult> GetCommentByUser(string UserId);

        /// <summary>
        /// Lấy ra các bình luận trên 1 cuốn sách
        /// </summary>
        /// <param name="BookId"></param>
        /// <returns></returns>
        Task<ActionServiceResult> GetCommentByBookDetail(string BookId);

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
