using Library.Management.Entity;
using Library.Management.Entity.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL
{
    public interface IBookDetailBL
    {
        /// <summary>
        /// Lấy thông tin phục vụ màn hình Monitor
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        Task<ActionServiceResult> GetMonitorActivation();

        /// <summary>
        /// Lọc dữ liệu phân trang
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 26/03/2021
        Task<ActionServiceResult> GetPagingData(ParamFilterBookDetail param);

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        Task<ActionServiceResult> InsertBookDetail(ParameterInsertBook param);

        /// <summary>
        /// Cập nhật 1 cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 19/03/2021
        Task<ActionServiceResult> UpdateBookDetail(ParameterUpdateBook param);

        /// <summary>
        /// Cập nhật ảnh đại diện sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        Task<ActionServiceResult> SaveBookImageToUri(object param);

        /// <summary>
        /// Lưu file mượn sách của thư viện
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns></returns>
        Task<ActionServiceResult> SaveFileBookInfo(object parameter);

        /// <summary>
        /// Lọc phân trang sách V2
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 07/04/2021
        Task<ActionServiceResult> GetPagingDataV2(ParamFilterBookDetailV2 param);
    }
}
