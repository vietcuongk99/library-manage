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
    public class BookDetailBL : IBookDetailBL
    {
        private readonly IBookDetailDL _bookDetailDL;
        private readonly IBaseDL<Book> _baseDL;
        public BookDetailBL(IBaseDL<Book> baseDL, IBookDetailDL bookDetailDL)
        {
            _baseDL = baseDL;
            _bookDetailDL = bookDetailDL;
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
                Data = await _baseDL.AddAsync(param)
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
                Data = await _bookDetailDL.InsertBookCategory(param)
            };
        }
    }
}
