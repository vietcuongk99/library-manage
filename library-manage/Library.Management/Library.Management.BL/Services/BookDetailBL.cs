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
        /// Lấy thông tin phục vụ màn Monitor
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 05/04/2021
        public async Task<ActionServiceResult> GetMonitorActivation()
        {
            var res = new ActionServiceResult();
            res.Data = await _bookDetailDL.GetMonitorActivation(ProcdureTypeName.GetMonitorActivation);
            return res;
        }

        /// <summary>
        /// Lọc dữ liệu phân trang
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 26/03/2021
        public async Task<ActionServiceResult> GetPagingData(ParamFilterBookDetail param)
        {
            var res = new ActionServiceResult();
            if (param.paramBookName == null) param.paramBookName = "";
            if (param.pageNumber <= 0) param.pageNumber = 1;
            if (param.pageSize <= 0) param.pageSize = int.Parse(GlobalResource.PageSize);
            if (param.paramBookCategoryID == null) param.paramBookCategoryID = "";

            res.Data = await _baseDL.GetEntityByMultipleTable<ResponseProcedureBookDetail>(param, ProcdureTypeName.GetPagingParamBookDetail);
            return res;
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
            var bookDetailCode = await _baseDL.GetEntityByCode(bookDetail.BookCode, ProcdureTypeName.GetByCode);
            if (bookDetailCode != null)
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
                        Data = await _baseDL.AddAsync(bookDetail, ProcdureTypeName.Insert)
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
            bookDetail.Status = (int)Status.Active;
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
                    var bookDetailCode = await _baseDL.GetEntityByCode(bookDetail.BookCode, ProcdureTypeName.GetByCode);
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
            bookDetail.Status = (int)Status.Active;
            bookDetail.BookAuthor = param.BookAuthor;
            bookDetail.AmountPage = param.AmountPage;
            bookDetail.YearOfPublication = param.YearOfPublication;
            bookDetail.Description = param.Description;
            bookDetail.ModifiedBy = GlobalResource.CreatedBy;
            bookDetail.ModifiedDate = DateTime.Now;
        }

        /// <summary>
        /// Cập nhật ảnh đại diện sách
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<ActionServiceResult> SaveBookImageToUri(object param)
        {
            var res = new ActionServiceResult();
            res.Data = await _baseDL.UpdateAsync(param, ProcdureTypeName.UpdateBookImageUri);
            return res;
        }

        /// <summary>
        /// Lưu file mượn sách của thư viện
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 23/03/2021
        public async Task<ActionServiceResult> SaveFileBookInfo(object parameter)
        {
            var res = new ActionServiceResult();
            res.Data = await _baseDL.UpdateAsync(parameter, ProcdureTypeName.UpdateBookDownloadUri);
            return res;
        }

        /// <summary>
        /// API lọc phân trang sách V2
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        /// CreatedBy: VDDUNG1 07/04/2021
        /// ModifiedBy: Cuong 07/04/2021
        public async Task<ActionServiceResult> GetPagingDataV2(ParamFilterBookDetailV2 param)
        {
            var res = new ActionServiceResult();
            //Truyền vào 1 số thông tin mặc định
            if (param.pageNumber == 0) param.pageNumber = 1;
            if (param.pageSize == 0) param.pageSize = int.Parse(GlobalResource.PageSize);

            //khai báo mặc định 1 đoạn build câu where
            string where = " Where b.Status = 1";
            string FTSearch = string.Empty, LikeSearch = string.Empty;
            int temp = 0;
            // vddung1 sửa lại điều kiện trong TH không nhập gì vào tìm kiếm
            if (!string.IsNullOrEmpty(param.searchValue))
            {
                string[] subs = param.searchValue.Split(' ');
                // Kiểm tra xem trong chuỗi có từ nào tối thiểu 3 kí tự hay không
                //Nếu có thì tìm kiếm fulltext, nếu không dùng like
                foreach(var sub in subs)
                {
                    if(sub.Length >= 3)
                    {
                        temp += 1;
                    }
                }
                if (param.searchType == (int)SearchType.AuthorName)
                {
                    FTSearch = " And MATCH(b.BookAuthor) AGAINST('" + param.searchValue + "' WITH QUERY EXPANSION)";
                    LikeSearch = " And b.BookAuthor like '%" + param.searchValue + "%'";
                    if (temp > 0)
                    {
                        where += FTSearch;
                    }
                    else
                    {
                        where += LikeSearch;
                    }
                }
                else if (param.searchType == (int)SearchType.BookName)
                {
                    FTSearch = " And MATCH(b.BookName) AGAINST('" + param.searchValue + "' WITH QUERY EXPANSION)";
                    LikeSearch = " And b.BookName like '%" + param.searchValue + "%'";
                    if (temp > 0)
                    {
                        where += FTSearch;
                    }
                    else
                    {
                        where += LikeSearch;
                    }
                }
            }
            if (param.paramBookCategoryID != null)
            {
                where += " And b.BookCategoryID = '" + param.paramBookCategoryID + "'";
            }
            if (param.startYear != null)
            {
                where += " And b.YearOfPublication >= " + param.startYear;
            }
            if (param.finishYear != null)
            {
                where += " And b.YearOfPublication <= " + param.finishYear;
            }
            if (param.maxValueType == (int)ValueTypeBook.Count)
            {
                if (param.orderByType == (int)OrderByType.ASC)
                {
                    where += " Order By b.BorrowTotal ASC";
                }
                else
                {
                    where += " Order By b.BorrowTotal DESC";
                }
            }
            else if (param.maxValueType == (int)ValueTypeBook.New)
            {
                if (param.orderByType == (int)OrderByType.ASC)
                {
                    where += " Order By b.CreatedDate ASC";
                }
                else
                {
                    where += " Order By b.CreatedDate DESC";
                }
            }
            else
            {
                where += " Order By b.CreatedDate DESC";
            }
            string query = "Select * from Book b" + where;
            //res.Data = _baseDL.ExcureDataReader(query);
            res.Data = await _baseDL.GetEntityByMultipleTable<ResponseProcedureBookDetail>(new { query }, ProcdureTypeName.GetPagingParamBookDetailV2);
            return res;
        }
    }
}
