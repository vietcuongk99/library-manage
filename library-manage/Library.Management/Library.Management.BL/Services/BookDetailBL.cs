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
        private readonly IBaseDL<BookCategory> _baseDLMaster;
        public BookDetailBL(IBaseDL<Book> baseDL, IBaseDL<BookCategory> baseDLMaster, IBookDetailDL bookDetailDL)
        {
            _baseDL = baseDL;
            _baseDLMaster = baseDLMaster;
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
            //Kiểm tra xem mã sách đã tồn tại hay chưa, nếu tồn tại rồi log lỗi luôn
            var bookDetailCode = await _baseDL.GetEntityByCode(bookDetail.BookCode);
            if(bookDetailCode != null)
            {
                return new ActionServiceResult
                {
                    Success = false,
                    Message = GlobalResource.ErrorBookExist,
                    LibraryCode = LibraryCode.ErrorBookExist
                };
            }

            //Kiểm tra xem loại sách đó đã tồn tại hay chưa
            //Nếu chưa tồn tại thì thông báo chưa tồn tại
            if (bookDetail.BookCategoryId != null)
            {
                var bookMaster = await _baseDLMaster.GetEntityById(bookDetail.BookCategoryId.ToString());
                if (bookMaster != null)
                {
                    return new ActionServiceResult
                    {
                        Success = true,
                        Message = GlobalResource.Success,
                        LibraryCode = LibraryCode.Success,
                        Data = await _baseDL.AddAsync(bookDetail)
                    };
                }
                else
                {
                    return new ActionServiceResult
                    {
                        Success = false,
                        Message = GlobalResource.ErrorBookCategory,
                        LibraryCode = LibraryCode.ErrorBookCategory
                    };
                }
            }
            // Mặc định trả về lỗi
            return new ActionServiceResult
            {
                Success = false,
                LibraryCode = LibraryCode.ErrorAddEntity,
                Message = GlobalResource.ErrorAddEntity,
            };
        }

        /// <summary>
        /// Chuyển dữ liệu từ request về Entity trước khi cập nhật lên DB
        /// </summary>
        /// <param name="param">Param đầu vào</param>
        /// <param name="bookDetail">Entity được cập nhật</param>
        /// CreatedBy: VDDUNG1 19/03/2021
        private void InsertRequestBuildBeforeUpdate(ParameterInsertBook param, Book bookDetail)
        {
            bookDetail.BookId = param.BookId;
            bookDetail.BookCode = param.BookCode;
            bookDetail.BookName = param.BookName;
            bookDetail.BookCategoryId = param.BookCategoryId;
            bookDetail.BookImageUri = param.BookImageUri;
            bookDetail.BookDownloadUri = param.BookDownloadUri;
            bookDetail.BorrowTotal = 0;
            bookDetail.Status = (int)StatusBook.Active;
            bookDetail.BookAuthor = param.BookAuthor;
            bookDetail.AmountPage = param.AmountPage;
            bookDetail.YearOfPublication = param.YearOfPublication;
            bookDetail.Description = param.Description;
            bookDetail.CreatedBy = GlobalResource.CreatedBy;
            bookDetail.CreatedDate = DateTime.Now;
        }

        /// <summary>
        /// Cập nhật 1 cuốn sách
        /// </summary>
        /// <param name="param">param truyền vào</param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 19/03/2021
        public async Task<ActionServiceResult> UpdateBookDetail(ParameterUpdateBook param)
        {
            var bookDetail = new Book();
            ConvertParamBeforeUpdate(param, bookDetail);

            if (bookDetail.BookId != null)
            {
                //checkID nếu chưa tồn tại bản ghi thì báo lỗi
                var bookDetailID = await _baseDL.GetEntityById(bookDetail.BookId.ToString());
                if (bookDetailID == null)
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
                    var bookDetailCode = await _baseDL.GetEntityByCode(bookDetail.BookCode);
                    if (bookDetailCode != null && bookDetailCode.BookCode != bookDetailID.BookCode)
                    {
                        return new ActionServiceResult
                        {
                            Success = false,
                            Message = GlobalResource.ErrorBookExist,
                            LibraryCode = LibraryCode.ErrorBookExist
                        };
                    }
                    else
                    {
                        return new ActionServiceResult
                        {
                            Success = true,
                            Message = GlobalResource.Success,
                            LibraryCode = LibraryCode.Success,
                            Data = await _baseDL.UpdateAsync(bookDetail, ProcdureTypeName.Update)
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
        /// <param name="param">Param đầu vào</param>
        /// <param name="bookDetail">Entity được cập nhật</param>
        /// CreatedBy: VDDUNG1 19/03/2021
        private void ConvertParamBeforeUpdate(ParameterUpdateBook param, Book bookDetail)
        {
            bookDetail.BookId = param.BookId;
            bookDetail.BookCode = param.BookCode;
            bookDetail.BookName = param.BookName;
            bookDetail.BookCategoryId = (Guid)param.BookCategoryId;
            bookDetail.BookImageUri = param.BookImageUri;
            bookDetail.BookDownloadUri = param.BookDownloadUri;
            bookDetail.BorrowTotal = param.BorrowTotal;
            bookDetail.Status = param.Status;
            bookDetail.BookAuthor = param.BookAuthor;
            bookDetail.AmountPage = param.AmountPage;
            bookDetail.YearOfPublication = param.YearOfPublication;
            bookDetail.Description = param.Description;
            bookDetail.ModifiedBy = GlobalResource.CreatedBy;
            bookDetail.ModifiedDate = DateTime.Now;
        }
    }
}
