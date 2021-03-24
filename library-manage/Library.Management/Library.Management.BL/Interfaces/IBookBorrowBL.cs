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
        /// Thêm mới giao dịch mượn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> InsertBookBorrow(ParameterInsertBookBorrow param);
        /// <summary>
        /// Cập nhật thông tin trả sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> UpdateBookBorrow(ParameterUpdateBookBorrow param);
        /// <summary>
        /// Cập nhật thông tin gia hạn sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> ExtendBookBorrow(ParameterExtendBookBorrow param);
        
    }
}
