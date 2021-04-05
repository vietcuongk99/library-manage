using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IBookBorrowBL
    {
        /// <summary>
        /// Lấy sách đã mượn của người dùng
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 29/03/2021
        Task<ActionServiceResult> GetPagingData(ParamFilterBookBorrow param);

        /// <summary>
        /// Danh sách các yêu cầu mượn sách
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 04/04/2021
        Task<ActionServiceResult> GetListRequestActivation();

        /// <summary>
        /// Thêm mới giao dịch mượn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> BorrowActivation(ParameterInsertBookBorrow param);

        /// <summary>
        /// Xác nhận yêu cầu mượn sách từ phía Admin
        /// </summary>
        /// <param name="id"></param>
        /// <param name="statusActivate"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 04/04/2021
        Task<ActionServiceResult> ConfirmBorrowActivation(string id, int statusActivate);

        /// <summary>
        /// Cập nhật thông tin trả sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> RestoreActivation(ParameterUpdateBookBorrow param);

        /// <summary>
        /// Cập nhật thông tin gia hạn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> ExtendActivation(ParameterExtendBookBorrow param);
        
    }
}
