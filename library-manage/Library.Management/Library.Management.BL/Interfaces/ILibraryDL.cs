using Library.Management.BL.Entities.Request;
using Library.Management.BL.Entities.Response;
using Library.Management.BL.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL.Interfaces
{
    public interface ILibraryDL
    {
        /// <summary>
        /// Lấy ra dữ liệu bản ghi thông qua khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        Task<Book> GetEntitiesByID(string id);

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        Task<object> InsertBookDetail(ParameterInsertBook param);

        /// <summary>
        /// Thêm 1 bản ghi thông tin thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        Task<object> InsertBookCategory(ParameterInsertBookCategory param);
    }
}
