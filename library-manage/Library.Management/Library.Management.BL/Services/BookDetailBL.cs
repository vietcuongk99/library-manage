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
            var bookDetail = new Book();
            InsertRequestBuildBeforeUpdate(param, bookDetail);
            return new ActionServiceResult
            {
                Success = true,
                Message = GlobalResource.Success,
                LibraryCode = LibraryCode.Success,
                Data = await _baseDL.AddAsync(bookDetail)
            };
        }

        /// <summary>
        /// Chuyển dữ liệu từ request về Entity trước khi cập nhật lên DB
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <param name="bookDetail">Entity được cập nhật</param>
        /// CreatedBy: VDDUNG1 19/03/2021
        private static void InsertRequestBuildBeforeUpdate(ParameterInsertBook param, Book bookDetail)
        {
            bookDetail.BookId = Guid.NewGuid();
            bookDetail.BookCode = param.BookCode;
            bookDetail.BookName = param.BookName;
            bookDetail.BookCategoryId = param.BookCategoryId;
            bookDetail.BookImageUri = param.BookImageUri;
            bookDetail.BookDownloadUri = param.BookDownloadUri;
            bookDetail.BorrowTotal = 0;
            bookDetail.Status = 1;
            bookDetail.BookAuthor = param.BookAuthor;
            bookDetail.AmountPage = param.AmountPage;
            bookDetail.YearOfPublication = param.YearOfPublication;
            bookDetail.Description = param.Description;
            bookDetail.CreatedBy = GlobalResource.CreatedBy;
            bookDetail.CreatedDate = DateTime.Now;
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
