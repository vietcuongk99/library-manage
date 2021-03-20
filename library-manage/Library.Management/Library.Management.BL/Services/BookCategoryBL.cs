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
            bookMaster.BookCategoryId = param.BookCategoryId;
            bookMaster.BookCategoryCode = param.BookCategoryCode;
            bookMaster.BookCategoryName = param.BookCategoryName;
            bookMaster.Amount = 0;
            bookMaster.Status = (int)StatusBook.Active;
            bookMaster.CreatedDate = DateTime.Now;
            bookMaster.CreatedBy = GlobalResource.CreatedBy;
        }

        /// <summary>
        /// Cập nhật thể loại sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 19/03/2021
        public async Task<ActionServiceResult> UpdateBookCategory(ParameterUpdateBookCategory param)
        {
            var bookMaster = new BookCategory();
            ConvertParamBeforeUpdate(param, bookMaster);

            if (bookMaster.BookCategoryId != null)
            {
                //checkID nếu chưa tồn tại bản ghi thì báo lỗi
                var bookMasterID = await _baseDLMaster.GetEntityById(bookMaster.BookCategoryId.ToString());
                if (bookMasterID == null)
                {
                    return new ActionServiceResult
                    {
                        Success = false,
                        Message = GlobalResource.ErrorNotIDEntity,
                        LibraryCode = LibraryCode.ErrorNotIDEntity
                    };
                }
                else
                {
                    //Kiểm tra xem mã Code đã tồn tại chưa, nếu tồn tại rồi thì báo đã tồn tại
                    var bookMasterCode = await _baseDLMaster.GetEntityByCode(bookMaster.BookCategoryCode);
                    if (bookMasterCode != null && bookMasterCode.BookCategoryCode != bookMasterID.BookCategoryCode)
                    {
                        return new ActionServiceResult
                        {
                            Success = false,
                            Message = GlobalResource.ErrorBookCategoryExist,
                            LibraryCode = LibraryCode.ErrorBookCategoryExist
                        };
                    }
                    else
                    {
                        return new ActionServiceResult
                        {
                            Success = true,
                            Message = GlobalResource.Success,
                            LibraryCode = LibraryCode.Success,
                            Data = await _baseDLMaster.UpdateAsync(bookMaster)
                        };
                    }
                }
            }
            // Mặc định trả về lỗi
            return new ActionServiceResult
            {
                Success = false,
                LibraryCode = LibraryCode.ErrorUpdateEntity,
                Message = GlobalResource.ErrorUpdateEntity,
            };
        }

        /// <summary>
        /// Chuyển dữ liệu từ request về Entity trước khi cập nhật lên DB
        /// </summary>
        /// <param name="param">đầu vào</param>
        /// <param name="bookMaster">response cập nhật lên db</param>
        /// CreatedBy: VDDUNG1 19/03/2021
        private void ConvertParamBeforeUpdate(ParameterUpdateBookCategory param, BookCategory bookMaster)
        {
            bookMaster.BookCategoryId = param.BookCategoryId;
            bookMaster.BookCategoryCode = param.BookCategoryCode;
            bookMaster.BookCategoryName = param.BookCategoryName;
            bookMaster.Amount = param.Amount;
            bookMaster.Status = (ulong)param.Status;
            bookMaster.ModifiedDate = DateTime.Now;
            bookMaster.ModifiedBy = GlobalResource.CreatedBy;
        }
    }
}
