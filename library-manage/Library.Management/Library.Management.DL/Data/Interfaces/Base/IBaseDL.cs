using Library.Management.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.DL
{
    public interface IBaseDL<T>
    {

        /// <summary>
        /// Lấy toàn bộ dữ liệu trong bảng
        /// </summary>
        /// <returns></returns>
        Task<IReadOnlyList<T>> GetListAsync();

        /// <summary>
        /// Lấy ra thông tin bản ghi theo khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<T> GetEntityById(string Id);

        /// <summary>
        /// Lấy ra thông tin bản ghi theo mã bản ghi
        /// </summary>
        /// <param name="code">Mã bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<T> GetEntityByCode(string code, ProcdureTypeName procdureTypeName);

        /// <summary>
        /// Thêm mới dữ liệu
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<object> AddAsync(object param, ProcdureTypeName procdureTypeName);
        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="param">Param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<object> UpdateAsync(object param, ProcdureTypeName procedureTypeName);

        /// <summary>
        /// Xóa nhiều bản ghi
        /// </summary>
        /// <param name="listID">List ID bản ghi</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 17/03/2021
        Task<int> Delete(object id);
    }
}
