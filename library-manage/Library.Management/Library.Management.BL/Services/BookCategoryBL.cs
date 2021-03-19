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
    public class BookCategoryBL : IBookCategoryBL
    {
        private readonly IBookCategoryDL _bookCategoryDL;
        private readonly IBaseDL<BookCategory> _baseDLMaster;
        public BookCategoryBL(IBaseDL<BookCategory> baseDLMaster, IBookCategoryDL bookCategoryDL)
        {
            _baseDLMaster = baseDLMaster;
            _bookCategoryDL = bookCategoryDL;
        }
        /// <summary>
        /// Thêm 1 bản ghi thông tin thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 14/03/2021
        public async Task<ActionServiceResult> InsertBookCategory(ParameterInsertBookCategory param)
        {
            var bookMaster = new BookCategory();
            InsertRequestBuildBeforeUpdate(param, bookMaster);
            //Kiểm tra xem mã loại sách đã tồn tại hay chưa, nếu tồn tại rồi log lỗi luôn
            var bookMasterCode = await _baseDLMaster.GetEntityByCode(bookMaster.BookCategoryCode);
            if (bookMasterCode != null)
            {
                return new ActionServiceResult
                {
                    Success = false,
                    Message = GlobalResource.ErrorBookCategoryExist,
                    LibraryCode = LibraryCode.ErrorBookCategoryExist
                };
            }
            return new ActionServiceResult
            {
                Success = true,
                Message = GlobalResource.Success,
                LibraryCode = LibraryCode.Success,
                Data = await _baseDLMaster.AddAsync(bookMaster)
            };
        }

        /// <summary>
        /// Chuyển dữ liệu từ request về Entity trước khi cập nhật lên DB
        /// </summary>
        /// <param name="param">đầu vào</param>
        /// <param name="bookMaster">response cập nhật lên db</param>
        /// CreatedBy: VDDUNG1 19/03/2021
        private void InsertRequestBuildBeforeUpdate(ParameterInsertBookCategory param, BookCategory bookMaster)
        {
            bookMaster.BookCategoryId = Guid.NewGuid();
            bookMaster.BookCategoryCode = param.BookCategoryCode;
            bookMaster.BookCategoryName = param.BookCategoryName;
            bookMaster.Amount = 0;
            bookMaster.Status = (int)StatusBook.Active;
            bookMaster.CreatedDate = DateTime.Now;
            bookMaster.CreatedBy = GlobalResource.CreatedBy;
        }
    }
}
