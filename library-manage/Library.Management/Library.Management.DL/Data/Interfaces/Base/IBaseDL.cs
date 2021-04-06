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
        Task<IReadOnlyList<T>> GetListAsync(ProcdureTypeName procdureTypeName);

        /// <summary>
        /// Lấy ra toàn bộ dữ liệu của 1 bảng entity truyền vào
        /// </summary>
        /// <typeparam name="Y"></typeparam>
        /// <param name="procdureTypeName"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        Task<IReadOnlyList<Y>> GetListAsyncV2<Y>(ProcdureTypeName procdureTypeName);

        /// <summary>
        /// Lấy ra toàn bộ dữ liệu theo điều kiện (entity)
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="procdureTypeName"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        Task<IReadOnlyList<T>> GetListAsyncByEntity(object entity, ProcdureTypeName procdureTypeName);

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
        /// Lấy dữ liệu theo 1 số entity truyền vào
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="procdureTypeName"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 26/03/2021
        Task<T> GetEntityByProperty(object entity, ProcdureTypeName procdureTypeName);
        /// <summary>
        /// Multiple Table 
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="procdureTypeName"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 26/03/2021
        Task<object> GetEntityByMultipleTable<Y>(object entity, ProcdureTypeName procdureTypeName);

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
