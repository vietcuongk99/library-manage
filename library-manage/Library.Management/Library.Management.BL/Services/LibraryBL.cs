using Library.Management.BL.Entities.Request;
using Library.Management.BL.Entities.Response;
using Library.Management.BL.Enums;
using Library.Management.BL.Interfaces;
using Library.Management.BL.Models;
using Library.Management.BL.Properties;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Library.Management.BL.Services
{
    public class LibraryBL : ILibraryBL
    {
        private readonly ILibraryDL _libraryDL;
        public LibraryBL(ILibraryDL libraryDL)
        {
            _libraryDL = libraryDL;
        }
        /// <summary>
        /// Lấy ra dữ liệu bản ghi thông qua khóa chính
        /// </summary>
        /// <param name="id">Khóa chính</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<Book> GetEntitiesByID(string id)
        {
            return await _libraryDL.GetEntitiesByID(id);
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<ActionServiceResult> InsertBookDetail(ParameterInsertBook param)
        {
            param.BookId = Guid.NewGuid();
            param.ActivedBook = 0;
            param.Status = (int)StatusBook.Active;
            param.CreatedDate = DateTime.Now;
            param.CreatedBy = GlobalResource.CreatedBy;
            return new ActionServiceResult
            {
                Success = true,
                Message = GlobalResource.Success,
                LibraryCode = LibraryCode.Success,
                Data = await _libraryDL.InsertBookDetail(param)
            };
        }

        /// <summary>
        /// Thêm 1 bản ghi thông tin thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<ActionServiceResult> InsertBookCategory(ParameterInsertBookCategory param)
        {
            param.BookCategoryId = Guid.NewGuid();
            param.Status = (int)StatusBook.Active;
            return new ActionServiceResult
            {
                Success = true,
                Message = GlobalResource.Success,
                LibraryCode = LibraryCode.Success,
                Data = await _libraryDL.InsertBookCategory(param)
            };
        }
    }
}
